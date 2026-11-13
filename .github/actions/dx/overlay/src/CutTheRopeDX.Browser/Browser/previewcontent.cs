using System.Collections.Generic;

using CutTheRopeDX.Framework.Core;
using CutTheRopeDX.GameMain;

namespace CutTheRopeDX.Browser
{
    internal sealed class previewcontent
    {
        private readonly HashSet<string> optional = [];
        private readonly HashSet<string> selected = [];

        public previewcontent()
        {
            if (!CustomLevelSession.IsActive)
            {
                return;
            }

            foreach (PackDefinition pack in PackConfig.Packs)
            {
                add(optional, pack.BoxBackgrounds);
                add(optional, pack.BoxCovers);
            }
            add(selected, PackConfig.GetBoxBackgrounds(0));
            add(selected, PackConfig.GetBoxCovers(0));

            for (int index = 1; index <= 52; index++)
            {
                string suffix = index == 1 ? "01_new" : index.ToString("D2");
                optional.Add($"images/candies/obj_candy_{suffix}.webp");
            }
            add(selected, [CandySkinHelper.GetCandyResource(Preferences.GetIntForKey("PREFS_SELECTED_CANDY"))]);
        }

        public bool includes(string path)
        {
            return !optional.Contains(path) || selected.Contains(path);
        }

        private static void add(HashSet<string> paths, IEnumerable<string> resources)
        {
            foreach (string resource in resources)
            {
                if (!string.IsNullOrWhiteSpace(resource))
                {
                    paths.Add(ResourceMgr.ImageContentPath(resource) + BrowserAssetPlatform.ImageExtension);
                }
            }
        }
    }
}
