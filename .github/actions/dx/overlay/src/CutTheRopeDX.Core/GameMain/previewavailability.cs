using System;

namespace CutTheRopeDX.GameMain
{
    internal static class previewavailability
    {
        public static Func<string, int, bool> available;

        public static bool allows(string group, int index) => available?.Invoke(group, index) ?? true;

        public static int preference(string key, int value)
        {
            if (value == 0 || available == null) return value;
            string group = key switch
            {
                "PREFS_SELECTED_CANDY" => "candy",
                "PREFS_SELECTED_TRACE" => "trace",
                "PREFS_SELECTED_BACKGROUND" => "background",
                _ => null,
            };
            if (group == null) return value;
            return allows(group, group == "background" ? value - 1 : value) ? value : 0;
        }
    }
}
