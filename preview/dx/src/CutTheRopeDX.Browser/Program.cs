using System;
using System.Runtime.Versioning;

using CutTheRopeDX.Browser;
using CutTheRopeDX.Framework;
using CutTheRopeDX.Framework.Platform;

[assembly: SupportedOSPlatform("browser")]

await GLContextInterop.ImportAsync();
await FetchInterop.ImportAsync();
await AudioInterop.ImportAsync();
await StorageInterop.ImportAsync();
await BrowserCursorService.ImportAsync();
await BrowserVideoPlayer.ImportAsync();
await LevelQueryInterop.ImportAsync();

// Level-editor preview hook: a `data` query param carrying a base64 level XML boots straight
// into that level instead of the normal menu, mirroring the desktop build's `--level` switch.
CustomLevelBridge.TryActivateFromQuery();

int fbo = GLContextInterop.CreateContext("game");
int[] size = GLContextInterop.CanvasSize("game");
Console.WriteLine($"gl: fbo={fbo} size={size[0]}x{size[1]}");

SkiaSurface surface = new(fbo, size[0], size[1]);

BrowserContentStore content = new("./content/");
WebAudioBackend audio = new("./content/");
await content.LoadTier0Async("./content/tier0.json");
await content.LoadAllAssetsAsync("./content/assets.json", audio);
PlatformServices.Content = content;

BrowserHostApp host = new();
PlatformServices.Host = host;
PlatformServices.Render = new SkiaRenderBackend(surface);
PlatformServices.Preferences = new LocalStoragePreferenceStore();
PlatformServices.Cursor = new BrowserCursorService();
PlatformServices.VideoPlayerFactory = () => new BrowserVideoPlayer();

BrowserAssetPlatform assets = new(surface);

ScreenPresentation.Instance = new ScreenPresentation(2560, 1440);
ScreenPresentation.Instance.SetSurfaceSize(size[0], size[1]);
CutTheRopeDX.CtrBootstrap.Initialize(assets, audio, size[0], size[1], LanguageHelper.Current);

// Must run after Initialize: it calls Preferences.LoadPreferences(), which would clobber a
// preference this sets any earlier.
PreviewOptions.ApplyFromQuery();

GameLoop.Surface = surface;
GameLoop.Host = host;
InputRouter.Host = host;

Console.WriteLine("boot complete");
