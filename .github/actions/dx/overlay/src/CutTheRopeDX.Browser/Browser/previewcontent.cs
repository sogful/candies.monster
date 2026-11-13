using System;
using System.IO;
using System.Xml.Linq;
using System.Collections.Generic;
using CutTheRopeDX.Helpers;

using CutTheRopeDX.Framework.Core;
using CutTheRopeDX.GameMain;

namespace CutTheRopeDX.Browser
{
    internal sealed class previewcontent
    {
        private readonly HashSet<string> optional = [];
        private readonly HashSet<string> selected = [];
        private bool restrict;

        public previewcontent()
        {
            if (!CustomLevelSession.IsActive)
            {
                return;
            }

            if (CustomLevelFile.TryLoad(CustomLevelSession.LevelPath, out XElement map, out _))
            {
                restrict = true;
                foreach (string resource in LevelResourceScanner.GetRequiredResources(map, 0))
                {
                    string path = Resources.IsSound(resource) ? ContentPaths.GetSoundEffectPath(resource) + ".ogg" : ResourceMgr.ImageContentPath(resource) + BrowserAssetPlatform.ImageExtension;
                    selected.Add(path.Replace('\\', '/'));
                }
                selected.Add("sounds/game_music.ogg");
            }

            add(selected, [Resources.Img.ObjCandyFx, Resources.Img.ObjSpider, Resources.Img.ObjBee,
                Resources.Img.ObjGhost, Resources.Img.FxSleep, Resources.Img.FxHalloween,
                Resources.Img.ConfettiParticles, Resources.Img.ConfettiParticlesExp, Resources.Img.ProfessorHand]);
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
            if (selected.Contains(path)) return true;
            if (optional.Contains(path)) return false;
            if (!restrict) return true;
            if (path.StartsWith("sounds/", StringComparison.Ordinal)) return false;
            if (!path.StartsWith("images/", StringComparison.Ordinal)) return true;
            string name = Path.GetFileNameWithoutExtension(path);
            return name.StartsWith("zepto", StringComparison.Ordinal) || name.StartsWith("menu_", StringComparison.Ordinal) || name.StartsWith("font_", StringComparison.Ordinal) || name.StartsWith("hud_", StringComparison.Ordinal);
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
