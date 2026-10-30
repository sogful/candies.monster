import argparse
import datetime
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys

bundle = Path(__file__).resolve().parent
repository = bundle.parents[2]
settings = json.loads((bundle / "upstream.json").read_text(encoding="utf-8"))

########################################################################

def run(arguments, directory, timeout=300, capture=False):
    print(" ".join(str(value) for value in arguments), flush=True)
    environment = {**os.environ, "MSBUILDDISABLENODEREUSE": "1"}
    result = subprocess.run(arguments, cwd=directory, check=True, timeout=timeout, env=environment,
                            text=True, stdout=subprocess.PIPE if capture else None)
    return result.stdout.strip() if capture else None


def writejson(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="\n") as file:
        json.dump(value, file, indent=4)
        file.write("\n")
        file.flush()
        os.fsync(file.fileno())


def overlayhash():
    digest = hashlib.sha256()
    for path in sorted((bundle / "overlay").rglob("*")):
        if path.is_file():
            digest.update(path.relative_to(bundle).as_posix().encode("utf-8"))
            digest.update(b"\0")
            digest.update(path.read_bytes())
    return digest.hexdigest()


def dotnet(source):
    candidates = [os.environ.get("CTRDX_DOTNET"), shutil.which("dotnet"), str(Path.home() / ".dotnet/dotnet.exe")]
    for candidate in candidates:
        if candidate and Path(candidate).is_file():
            result = subprocess.run([candidate, "--version"], cwd=source, capture_output=True, text=True, timeout=30)
            if result.returncode == 0 and result.stdout.strip():
                return candidate
    raise RuntimeError("Install the SDK specified by the staged global.json, or set CTRDX_DOTNET.")


def prepare(reference):
    work = repository / ".claude/work/dxupdates"
    stamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%d%H%M%S%f")
    stage = work / stamp
    source = stage / "source"
    stage.mkdir(parents=True)
    run(["git", "init", str(source)], repository)
    run(["git", "-C", str(source), "remote", "add", "origin", settings["repository"]], repository)
    run(["git", "-C", str(source), "fetch", "--depth", "1", "origin", reference], repository)
    run(["git", "-C", str(source), "checkout", "--detach", "FETCH_HEAD"], repository)
    revision = run(["git", "rev-parse", "HEAD"], source, capture=True)
    patch = bundle / "preview.patch"
    run(["git", "apply", "--check", "--whitespace=error", str(patch)], source)
    run(["git", "apply", "--whitespace=error", str(patch)], source)
    shutil.copytree(bundle / "overlay", source, dirs_exist_ok=True)
    writejson(stage / "revision.json", {
        "repository": settings["repository"], "revision": revision,
        "patch": hashlib.sha256(patch.read_bytes()).hexdigest(),
        "overlay": overlayhash(),
        "runtime": "single", "aot": True,
    })
    for name in ["main.js", "playtest.js", "host-events.js", "audio.js"]:
        run(["node", "--check", str(source / "src/CutTheRopeDX.Browser/wwwroot" / name)], source)
    print(f"Prepared {revision} in {stage}", flush=True)
    if os.environ.get("GITHUB_OUTPUT"):
        with open(os.environ["GITHUB_OUTPUT"], "a", encoding="utf-8") as file:
            file.write(f"stage={stage}\nrevision={revision}\nglobaljson={source / 'global.json'}\n")
    return stage


def validate(site):
    for relative in ["index.html", "main.js", "playtest.js", "content/assets.json", "content/tier0.json", "_framework/dotnet.js"]:
        path = site / relative
        if not path.is_file() or path.stat().st_size == 0:
            raise RuntimeError(f"Missing published file: {relative}")
    manifest = json.loads((site / "content/assets.json").read_text(encoding="utf-8"))
    for paths in manifest.values():
        if not isinstance(paths, list):
            raise RuntimeError("Upstream changed the content manifest format.")
        for relative in paths:
            if not isinstance(relative, str):
                raise RuntimeError("Upstream changed the content manifest entries.")
            path = (site / "content" / relative).resolve()
            if not path.is_relative_to((site / "content").resolve()) or not path.is_file():
                raise RuntimeError(f"Missing content asset: {relative}")


def build(stage):
    source = stage / "source"
    record = json.loads((stage / "revision.json").read_text(encoding="utf-8"))
    if record["patch"] != hashlib.sha256((bundle / "preview.patch").read_bytes()).hexdigest():
        raise RuntimeError("The patch changed after staging. Prepare a fresh stage.")
    if record["overlay"] != overlayhash():
        raise RuntimeError("The overlay changed after staging. Prepare a fresh stage.")
    executable = dotnet(source)
    run([executable, "run", "--project", "content/Builder", "--", "fetch"], source, timeout=1800)
    run([sys.executable, "scripts/build_web_content.py", "--skip-video", "--no-progress"], source, timeout=1800)
    run([executable, "publish", "src/CutTheRopeDX.Browser/CutTheRopeDX.Browser.csproj",
         "-c", "Release", "-p:CtrdxSingleThreaded=true", "-p:RunAOTCompilation=true",
         "-p:EnableDefaultCompressionFormats=false", "-p:DisableBuildCompression=true",
         "-o", str(stage / "publish")], source, timeout=3600)
    if record["patch"] != hashlib.sha256((bundle / "preview.patch").read_bytes()).hexdigest() or record["overlay"] != overlayhash():
        raise RuntimeError("The preview patches changed during the build. Prepare a fresh stage.")
    site = stage / "publish/wwwroot"
    validate(site)
    stamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%d%H%M%S%f")
    excluded = stage / "excluded" / stamp
    for path in list(site.rglob("*")):
        if path.is_file() and (path.suffix in (".br", ".gz", ".pdb", ".xml", ".rej") or path.name.startswith("service-worker-assets")):
            target = excluded / path.relative_to(site)
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(path), str(target))
    (site / ".nojekyll").touch()
    writejson(site / "upstream.json", record)
    validate(site)
    writejson(stage / "validated.json", {"revision": record["revision"], "checks": "patch, source syntax, AOT publish, asset references"})
    print(f"Built {record['revision']}: {site}", flush=True)


def install(stage):
    if not (stage / "validated.json").is_file():
        raise RuntimeError("Build and validate this stage before installation.")
    site = stage / "publish/wwwroot"
    validate(site)
    record = json.loads((site / "upstream.json").read_text(encoding="utf-8"))
    destination = repository / "preview/dx/dist/wwwroot"
    backup = stage / "previous/wwwroot"
    if backup.exists():
        stamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%d%H%M%S%f")
        backup = stage / "previous" / stamp / "wwwroot"
    if not destination.resolve().is_relative_to(repository.resolve()):
        raise RuntimeError("Invalid destination.")
    backup.parent.mkdir(parents=True, exist_ok=True)
    configuration = repository / ".github/actions/dx/upstream.json"
    previous = configuration.read_bytes() if configuration.exists() else None
    if previous is not None:
        (backup.parent / "upstream.json").write_bytes(previous)
    if destination.exists():
        shutil.move(str(destination), str(backup))
    try:
        shutil.copytree(site, destination)
        writejson(configuration, {"repository": record["repository"], "revision": record["revision"]})
    except BaseException:
        if destination.exists():
            shutil.move(str(destination), str(stage / "incomplete"))
        if backup.exists():
            shutil.move(str(backup), str(destination))
        if previous is not None:
            configuration.write_bytes(previous)
        raise
    print(f"Installed locally. Previous build: {backup}", flush=True)


########################################################################

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--latest", action="store_true")
    parser.add_argument("--ref")
    parser.add_argument("--stage", type=Path)
    parser.add_argument("--build", action="store_true")
    parser.add_argument("--install", action="store_true")
    arguments = parser.parse_args()
    if arguments.stage and (arguments.latest or arguments.ref):
        parser.error("--stage cannot be combined with --latest or --ref")
    stage = arguments.stage.resolve() if arguments.stage else prepare(arguments.ref or ("main" if arguments.latest else settings["revision"]))
    if arguments.build:
        build(stage)
    if arguments.install:
        install(stage)


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, OSError, subprocess.SubprocessError) as error:
        print(f"DX update failed: {error}", file=sys.stderr)
        sys.exit(1)
