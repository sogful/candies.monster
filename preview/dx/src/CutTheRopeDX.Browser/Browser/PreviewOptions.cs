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
        }
    }
}
