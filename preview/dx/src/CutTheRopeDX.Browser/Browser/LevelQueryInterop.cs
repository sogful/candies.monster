using System.Runtime.InteropServices.JavaScript;
using System.Threading.Tasks;

namespace CutTheRopeDX.Browser
{
    /// <summary>Thin managed wrapper over the levelquery.js URL query reader.</summary>
    internal static partial class LevelQueryInterop
    {
        /// <summary>Imports levelquery.js. Must be awaited once before any other call.</summary>
        public static Task ImportAsync()
        {
            return JSHost.ImportAsync("levelquery", "../levelquery.js");
        }

        /// <summary>Reads a query string parameter, or null when it is absent.</summary>
        [JSImport("getParam", "levelquery")]
        public static partial string GetParam(string name);
    }
}
