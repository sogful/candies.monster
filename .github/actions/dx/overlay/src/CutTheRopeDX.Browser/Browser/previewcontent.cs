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
                Resources.Img.HatXmas, Resources.Img.HatHalloween, Resources.Img.ObjHook,
                Resources.Img.ConfettiParticles, Resources.Img.ConfettiParticlesExp, Resources.Img.ProfessorHand]);
            foreach (PackDefinition pack in PackConfig.Packs)
            {
                add(optional, pack.BoxBackgrounds);
                add(optional, pack.BoxCovers);
            }
            if (PackConfig.Packs.Count > 0) add(selected, PackConfig.Packs[0].BoxBackgrounds);
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

        public bool customizationimage(string path)
        {
            return optional.Contains(path)
                || path.StartsWith("images/backgrounds/bgr_", StringComparison.Ordinal)
                || path.StartsWith("images/char_", StringComparison.Ordinal)
                || path is "images/skin_selection.webp" or "images/backgrounds/skin_bg.webp"
                    or "images/fingertrace_skin.webp" or "images/candy_selection_fx.webp"
                    or "images/fx_sleep.webp" or "images/fx_bubbles.webp";
        }

        public static bool customizationgroup(string path, string group, int index)
        {
            return group switch
            {
                "menu" => path is "images/skin_selection.webp" or "images/backgrounds/skin_bg.webp",
                "candy" => path == (index == 0 ? "images/candies/obj_candy_01_new.webp" : $"images/candies/obj_candy_{index + 1:D2}.webp"),
                "trace" => path == "images/fingertrace_skin.webp",
                "omnom" => path.StartsWith("images/char_", StringComparison.Ordinal) || path is "images/fx_sleep.webp" or "images/fx_bubbles.webp",
                "backgrounds" => path.StartsWith("images/backgrounds/bgr_", StringComparison.Ordinal) || path.StartsWith("images/bgr_", StringComparison.Ordinal),
                _ => false,
            };
        }

        public bool customizationsound(string path)
        {
            if (path.StartsWith("sounds/sfx/monster_", StringComparison.Ordinal)) return true;
            foreach (OmNomSkinDefinition skin in OmNomSkinRegistry.XmlSkins)
            {
                foreach (string sound in new[] {Resources.Snd.MonsterChewing, Resources.Snd.MonsterClose,
                    Resources.Snd.MonsterOpen, Resources.Snd.MonsterSad, Resources.Snd.MonsterExcited,
                    Resources.Snd.MonsterGreeting, Resources.Snd.MonsterSleep1, Resources.Snd.MonsterSleep2,
                    Resources.Snd.MonsterSleep3})
                {
                    string resolved = OmNomSoundResolver.ResolveSoundResource(skin, sound);
                    if (resolved != null && path == ContentPaths.GetSoundEffectPath(resolved).Replace('\\', '/') + ".ogg") return true;
                }
            }
            return false;
        }

        public static string[] backgroundpaths(int pack, bool covers)
        {
            HashSet<string> paths = [];
            if (PackConfig.isbackgroundpack(pack))
            {
                add(paths, covers ? PackConfig.Packs[pack].BoxCovers : PackConfig.Packs[pack].BoxBackgrounds);
            }
            return [.. paths];
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
