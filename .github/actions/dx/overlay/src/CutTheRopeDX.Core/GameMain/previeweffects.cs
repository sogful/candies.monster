using CutTheRopeDX.Framework.Platform;

namespace CutTheRopeDX.GameMain
{
    internal static class previeweffects
    {
        private static bool? low;
        public static bool reduced
        {
            get
            {
                low ??= PlatformServices.Host?.previewquality == "Low";
                return low.Value;
            }
        }
    }
}
