using System;

namespace CutTheRopeDX.GameMain
{
    /// <summary>
    /// Provides helper properties to determine whether seasonal events
    /// should be active based on the current system date.
    /// </summary>
    internal static class SpecialEvents
    {
        #region Christmas event

        private static bool? xmasOverride;

        /// <summary>
        /// Gets a value indicating whether the current month is January.
        /// </summary>
        public static bool IsJanuary => DateTime.Now.Month == 1;

        /// <summary>
        /// Gets a value indicating whether the Christmas event period is active.
        /// Includes December and January, unless overridden via <see cref="SetXmasOverride"/>.
        /// </summary>
        public static bool IsXmas => xmasOverride ?? (DateTime.Now.Month is 12 or 1);

        /// <summary>
        /// Forces <see cref="IsXmas"/> to a fixed value regardless of the calendar, or clears the
        /// override (pass <see langword="null"/>) to restore the calendar-based default. Used by
        /// the browser preview build's `?jolly` query param.
        /// </summary>
        public static void SetXmasOverride(bool? enabled)
        {
            xmasOverride = enabled;
        }

        #endregion
    }
}
