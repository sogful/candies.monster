using System;
using System.Threading.Tasks;

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
        private ScrollableContainer customizationscroll;
        private int? previousbackground;
        private int previoustrace;

        private void opencustomization()
        {
            if (overlayMode != GameControllerOverlayMode.Paused || customizationload != null) return;
            customizationload = PlatformServices.Host.loadcustomization();
            setcustomizelabel("Loading...");
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
                if (completed.IsCompletedSuccessfully)
                {
                    setcustomizelabel("Customize");
                    if (overlayMode == GameControllerOverlayMode.Paused && !navigationExitActive)
                    {
                        try
                        {
                            previousbackground = PackConfig.selectedbackground;
                            previoustrace = Preferences.GetIntForKey("PREFS_SELECTED_TRACE");
                            AddViewwithID(CandySelectionView.CreateCandySelection(new customizationbuttons(this), out customizationscroll, preview: true), customizationview);
                            ShowView(customizationview);
                        }
                        catch (InvalidOperationException error)
                        {
                            if (activeViewID == customizationview) ShowView(0);
                            Console.Error.WriteLine(error);
                            setcustomizelabel("Retry Customize");
                        }
                    }
                }
                else
                {
                    Console.Error.WriteLine(completed.Exception?.GetBaseException());
                    setcustomizelabel("Retry Customize");
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
            ShowView(0);
            DeleteView(customizationview);
            customizationscroll = null;
        }

        public override bool HandleMouseWheel(int delta)
        {
            if (activeViewID != customizationview || customizationscroll == null) return base.HandleMouseWheel(delta);
            customizationscroll.HandleMouseWheel(delta);
            return true;
        }

        private sealed class customizationbuttons(GameController owner) : IButtonDelegation
        {
            public void OnButtonPressed(ButtonId buttonId)
            {
                if (owner.activeViewID != customizationview) return;
                MenuButtonId selection = MenuButtonId.FromButtonId(buttonId);
                if (selection == MenuButtonId.BackFromCandySelect)
                {
                    owner.closecustomization();
                    return;
                }

                SoundMgr.PlaySound(Resources.Snd.Tap);
                CandySelectionView.handlepreviewselection(selection);
            }
        }
    }
}
