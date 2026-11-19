using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using CutTheRopeDX.Framework;
using CutTheRopeDX.Framework.Core;
using CutTheRopeDX.Framework.Media;
using CutTheRopeDX.Framework.Platform;
using CutTheRopeDX.Framework.Visual;

namespace CutTheRopeDX.GameMain
{
    internal sealed partial class GameController
    {
        private const int customizationview = 1;
        private Button customizebutton;
        private Task customizationload;
        private Action customizationready;
        private readonly List<(Button button, RGBAColor color, bool touchable)> dimmedbuttons = [];
        private ScrollableContainer customizationscroll;
        private int? previousbackground;
        private int previoustrace;
        private string previouscandy;
        private int previousomnom;

        private void opencustomization()
        {
            if (overlayMode != GameControllerOverlayMode.Paused || customizationload != null) return;
            setcustomizelabel("Loading...");
            loadcustomization("menu", showcustomization);
        }

        private void showcustomization()
        {
            setcustomizelabel("Customize");
            if (overlayMode != GameControllerOverlayMode.Paused || navigationExitActive) return;
            previousbackground = PackConfig.selectedbackground;
            previoustrace = Preferences.GetIntForKey("PREFS_SELECTED_TRACE");
            previouscandy = CandySkinHelper.GetCandyResource(Preferences.GetIntForKey("PREFS_SELECTED_CANDY"));
            previousomnom = OmNomSkinRegistry.GetSelectedSkinIndex();
            AddViewwithID(CandySelectionView.CreateCandySelection(new customizationbuttons(this), out customizationscroll, preview: true), customizationview);
            ShowView(customizationview);
        }

        private void loadcustomization(string group, Action ready, int index = -1)
        {
            customizationready = ready;
            dimbuttons(activeViewID == customizationview ? GetView(customizationview) : pauseButtonsGroup);
            customizationload = PlatformServices.Host.loadcustomization(group, index);
        }

        private void dimbuttons(BaseElement root)
        {
            if (root is Button button)
            {
                dimmedbuttons.Add((button, button.color, button.touchable));
                button.touchable = false;
                button.color.AlphaChannel *= 0.5f;
                return;
            }
            if (root?.GetChilds() is { } children)
            {
                foreach (BaseElement child in children.Values) dimbuttons(child);
            }
        }

        private void restorebuttons()
        {
            foreach (var item in dimmedbuttons)
            {
                item.button.color = item.color;
                item.button.touchable = item.touchable;
            }
            dimmedbuttons.Clear();
        }

        private void setcustomizelabel(string label)
        {
            ((Text)customizebutton.GetChild(0).GetChild(0)).SetString(label);
            ((Text)customizebutton.GetChild(1).GetChild(0)).SetString(label);
        }

        private void updatecustomization(float delta)
        {
            if (customizationload?.IsCompleted == true)
            {
                Task completed = customizationload;
                customizationload = null;
                Action ready = customizationready;
                customizationready = null;
                restorebuttons();
                try
                {
                    completed.GetAwaiter().GetResult();
                    ready();
                }
                catch (Exception error)
                {
                    Console.Error.WriteLine(error);
                    if (activeViewID != customizationview) setcustomizelabel("Retry Customize");
                }
            }

            if (activeViewID == customizationview) CandySelectionView.Update(delta);
        }

        private void closecustomization()
        {
            SoundMgr.PlaySound(Resources.Snd.Tap);
            GameScene scene = (GameScene)GetView(0).GetChild(GameView.VIEW_ELEMENT_GAME_SCENE);
            if (previousbackground != PackConfig.selectedbackground) scene.refreshbackground();
            if (previoustrace != Preferences.GetIntForKey("PREFS_SELECTED_TRACE")) scene.refreshtrace();
            string candy = CandySkinHelper.GetCandyResource(Preferences.GetIntForKey("PREFS_SELECTED_CANDY"));
            if (previouscandy != candy) scene.refreshcandy(previouscandy, candy);
            if (previousomnom != OmNomSkinRegistry.GetSelectedSkinIndex()) scene.refreshomnom();
            ShowView(0);
            DeleteView(customizationview);
            customizationscroll = null;
        }

        public override bool HandleMouseWheel(int delta)
        {
            if (customizationload != null) return true;
            if (activeViewID != customizationview || customizationscroll == null) return base.HandleMouseWheel(delta);
            customizationscroll.HandleMouseWheel(delta);
            return true;
        }

        private sealed class customizationbuttons(GameController owner) : IButtonDelegation
        {
            public void OnButtonPressed(ButtonId buttonId)
            {
                if (owner.activeViewID != customizationview || owner.customizationload != null) return;
                MenuButtonId selection = MenuButtonId.FromButtonId(buttonId);
                if (selection == MenuButtonId.BackFromCandySelect)
                {
                    owner.closecustomization();
                    return;
                }

                SoundMgr.PlaySound(Resources.Snd.Tap);
                (string group, int index) = CandySelectionView.previewresources(selection);
                if (group == null) CandySelectionView.handlepreviewselection(selection);
                else owner.loadcustomization(group, () => CandySelectionView.handlepreviewselection(selection), index);
            }
        }
    }
}
