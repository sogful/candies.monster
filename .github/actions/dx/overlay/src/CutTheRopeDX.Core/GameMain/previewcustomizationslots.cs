using System;
using System.Linq;

using CutTheRopeDX.Framework.Core;
using CutTheRopeDX.Framework.Visual;

namespace CutTheRopeDX.GameMain
{
    internal static partial class CandySelectionView
    {
        private const int backgroundfirstid = 8 << 24;
        private static readonly MenuButtonId backgroundtabid = new(backgroundfirstid - 1);
        private static Button backgroundtab;

        public static (string group, int index) previewresources(MenuButtonId selection)
        {
            if (selection == backgroundtabid) return ("backgrounds", -1);
            int background = selection.Value - backgroundfirstid;
            if (background > 0 && PackConfig.isbackgroundpack(background - 1)) return ("background", background - 1);
            MenuSkinSelectionAction action = MenuSkinSelectionActionResolver.Resolve(selection);
            if (action.Kind == MenuSkinSelectionActionKind.SwitchMode)
            {
                if (action.Mode == SkinSelectionMode.OmNom) return ("omnom", -1);
                if (action.Mode == SkinSelectionMode.Trace) return ("trace", -1);
            }
            if (action.Kind == MenuSkinSelectionActionKind.SelectSlot && action.Mode == SkinSelectionMode.Candy && action.SelectedIndex is int index)
            {
                return ("candy", index);
            }
            return (null, -1);
        }

        public static void handlepreviewselection(MenuButtonId selection)
        {
            if (selection == backgroundtabid)
            {
                SwitchToMode(CandySelectionMode.Background);
                return;
            }

            int background = selection.Value - backgroundfirstid;
            if (background == 0 || PackConfig.isbackgroundpack(background - 1))
            {
                Preferences.SetIntForKey(background, PackConfig.backgroundpreference, true);
                PackConfig.setbackgroundpackoverride(background > 0 ? background - 1 : null);
                UpdateCandySlotButtons(background);
                return;
            }

            MenuSkinSelectionAction action = MenuSkinSelectionActionResolver.Resolve(selection);
            if (action.Kind == MenuSkinSelectionActionKind.SwitchMode)
            {
                switch (action.Mode)
                {
                    case SkinSelectionMode.Candy: SwitchToCandyMode(); break;
                    case SkinSelectionMode.Rope: SwitchToRopeMode(); break;
                    case SkinSelectionMode.OmNom: SwitchToOmNomMode(); break;
                    case SkinSelectionMode.Trace: SwitchToTraceMode(); break;
                }
            }
            else if (action.Kind == MenuSkinSelectionActionKind.SelectSlot
                && action.SelectedIndex is int index && action.PreferenceKey != null)
            {
                Preferences.SetIntForKey(index, action.PreferenceKey, true);
                if (action.Mode == SkinSelectionMode.Candy) CandySkinHelper.setindexoverride(null);
                if (action.Mode == SkinSelectionMode.OmNom) SelectOmNomSlot(index);
                else UpdateCandySlotButtons(index);
            }
        }

        private static VBox createbackgroundgrid()
        {
            SkinSelectionLayout layout = CurrentLayout();
            int selected = (PackConfig.selectedbackground ?? -1) + 1;
            for (int pack = -1; pack < PackConfig.Packs.Count; pack++)
            {
                if (pack >= 0 && (!PackConfig.isbackgroundpack(pack) || !previewavailability.allows("background", pack))) continue;
                int imagepack = pack < 0 ? Application.SharedRootController().Pack : pack;
                string resource = PackConfig.GetBoxCoverOrDefault(imagepack);
                int option = pack + 1;
                Button slot = CreateSlotButton(option, selected, resource, -1, layout, new MenuButtonId(backgroundfirstid + option), -32f);
                string label = pack < 0 ? "Default" : PackConfig.GetPackTitle(pack, withNumber: false);
                fillbackgroundslot((Image)slot.GetChild(0), label);
                fillbackgroundslot((Image)slot.GetChild(1), label);
            }
            return FlowGrid(slotButtons, layout, out _, out _);
        }

        private static void fillbackgroundslot(Image slot, string label)
        {
            Image preview = (Image)slot.GetChild(0);
            preview.scaleX = preview.scaleY = MathF.Min(224f / preview.width, 158f / preview.height);
            Text title = new Text().InitWithFont(Application.GetFont(Resources.Fnt.BigFont));
            title.SetString(label);
            title.anchor = title.parentAnchor = 18;
            title.y = 69f;
            title.scaleX = title.scaleY = MathF.Min(0.58f, 236f / MathF.Max(1f, title.width));
            _ = slot.AddChild(title);
        }

    }
}
