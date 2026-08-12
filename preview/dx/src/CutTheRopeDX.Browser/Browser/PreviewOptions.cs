using CutTheRopeDX.Framework.Core;
using CutTheRopeDX.GameMain;

namespace CutTheRopeDX.Browser
{
    /// <summary>
    /// Applies extra candies.monster preview-tool URL params beyond the `data` level payload
    /// (see <see cref="CustomLevelBridge"/>).
    /// </summary>
    /// <remarks>
    /// Must run AFTER <c>CtrBootstrap.Initialize</c>, unlike <see cref="CustomLevelBridge"/> -
    /// <c>Initialize</c> calls <c>Preferences.LoadPreferences()</c>, which would overwrite a
    /// preference set any earlier.
    /// </remarks>
    internal static class PreviewOptions
    {
        /// <summary>Reads and applies every recognized preview-tool query param.</summary>
        public static void ApplyFromQuery()
        {
            if (LevelQueryInterop.GetParam("nomusic") != null)
            {
                Preferences.SetBooleanForKey(false, "MUSIC_ON", true);
            }

            if (LevelQueryInterop.GetParam("jolly") != null)
            {
                SpecialEvents.SetXmasOverride(true);
            }

            // 1-based on the URL (matches h5dx MOD's ?candy=), 0-based internally.
            if (TryGetQueryInt("candy", out int candyNumber) && candyNumber is >= 1 and <= 52)
            {
                CandySkinHelper.SetIndexOverride(candyNumber - 1);
            }

            // Also 1-based; selects which pack's background art to borrow, regardless of which
            // pack the custom level actually loads as (always pack 0 - see CustomLevelBridge).
            if (TryGetQueryInt("background", out int packNumber)
                && packNumber >= 1
                && packNumber <= PackConfig.Packs.Count)
            {
                PackConfig.SetBackgroundPackOverride(packNumber - 1);
            }
        }

        private static bool TryGetQueryInt(string name, out int value)
        {
            string raw = LevelQueryInterop.GetParam(name);
            return int.TryParse(raw, out value);
        }
    }
}
