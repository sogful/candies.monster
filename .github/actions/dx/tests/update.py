import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("dxupdate", Path(__file__).resolve().parents[1] / "update.py")
update = importlib.util.module_from_spec(spec)
spec.loader.exec_module(update)

########################################################################

class checks(unittest.TestCase):
    def setUp(self):
        self.root = Path(tempfile.mkdtemp(prefix="dxchecks-"))
        self.stage = self.root / "stage"
        self.site = self.stage / "publish/wwwroot"
        for name in ["index.html", "main.js", "playtest.js", "content/assets.json", "content/tier0.json", "_framework/dotnet.js", "content/images/test.webp"]:
            path = self.site / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text("test", encoding="utf-8")
        (self.site / "content/assets.json").write_text(json.dumps({"images": ["images/test.webp"]}), encoding="utf-8")
        (self.site / "upstream.json").write_text(json.dumps({"repository": "fixture", "revision": "fixture"}), encoding="utf-8")
        self.live = self.root / "preview/dx/dist/wwwroot"
        self.live.mkdir(parents=True)
        (self.live / "previous.txt").write_text("keep", encoding="utf-8")

    def testmissingasset(self):
        (self.site / "content/assets.json").write_text(json.dumps({"images": ["missing.webp"]}), encoding="utf-8")
        with self.assertRaisesRegex(RuntimeError, "Missing content"):
            update.validate(self.site)

    def testunbuiltinstall(self):
        with patch.object(update, "repository", self.root):
            with self.assertRaisesRegex(RuntimeError, "Build and validate"):
                update.install(self.stage)
        self.assertEqual((self.live / "previous.txt").read_text(), "keep")

    def testrollback(self):
        (self.stage / "validated.json").write_text("{}")
        with patch.object(update, "repository", self.root), patch.object(update.shutil, "copytree", side_effect=OSError("copy failed")):
            with self.assertRaisesRegex(OSError, "copy failed"):
                update.install(self.stage)
        self.assertEqual((self.live / "previous.txt").read_text(), "keep")

    def testbackup(self):
        (self.stage / "validated.json").write_text("{}")
        with patch.object(update, "repository", self.root):
            update.install(self.stage)
        self.assertEqual((self.stage / "previous/wwwroot/previous.txt").read_text(), "keep")
        update.validate(self.live)


if __name__ == "__main__":
    unittest.main()
