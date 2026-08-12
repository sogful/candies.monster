using System;
using System.IO;
using System.Text;
using System.Xml;
using System.Xml.Linq;

using CutTheRopeDX.GameMain;

namespace CutTheRopeDX.Browser
{
    /// <summary>
    /// Activates a custom-level run from a level-editor-supplied `data` URL query parameter,
    /// the browser equivalent of the desktop `--level` switch (see the Core project's
    /// <c>CommandLine</c> parser).
    /// </summary>
    /// <remarks>
    /// The desktop switch takes a real file path; the browser has no such thing, so this writes
    /// the decoded level XML into the WASM runtime's in-memory virtual file system instead, then
    /// activates <see cref="CustomLevelSession"/> against that virtual path exactly as the
    /// desktop build does against a real one - GameScene/CTRRootController don't need to know
    /// the difference.
    /// </remarks>
    internal static class CustomLevelBridge
    {
        private const string VirtualLevelPath = "/preview-level.xml";

        /// <summary>
        /// Reads the `data` query parameter, decodes it as a base64 level XML document, and
        /// activates a custom-level run if present and valid. Errors are logged, never thrown -
        /// a malformed or absent param just falls through to the normal menu.
        /// </summary>
        public static void TryActivateFromQuery()
        {
            string data = LevelQueryInterop.GetParam("data");
            if (string.IsNullOrWhiteSpace(data))
            {
                return;
            }

            string xml;
            try
            {
                xml = DecodeBase64Utf8(data);
            }
            catch (FormatException ex)
            {
                Console.Error.WriteLine("preview: could not base64-decode the 'data' param: " + ex.Message);
                return;
            }

            try
            {
                // Validated eagerly so a malformed level fails loudly here, at boot, rather than
                // silently inside CustomLevelFile.TryLoad once gameplay is already starting.
                _ = XDocument.Parse(xml);
            }
            catch (XmlException ex)
            {
                Console.Error.WriteLine("preview: 'data' param is not valid level XML: " + ex.Message);
                return;
            }

            File.WriteAllText(VirtualLevelPath, xml, Encoding.UTF8);
            CustomLevelSession.Activate(VirtualLevelPath);
        }

        // Mirrors the candies.monster preview tool's decodebase64utf8(): URL-safe base64
        // ('-'/'_' instead of '+'/'/'), no padding guaranteed, UTF-8 payload.
        private static string DecodeBase64Utf8(string data)
        {
            string normalized = data.Replace('-', '+').Replace('_', '/');
            int padding = (4 - (normalized.Length % 4)) % 4;
            normalized += new string('=', padding);
            byte[] bytes = Convert.FromBase64String(normalized);
            return Encoding.UTF8.GetString(bytes);
        }
    }
}
