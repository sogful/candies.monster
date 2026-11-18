using System;
using System.Collections.Generic;
using CutTheRopeDX.Framework.Core;
using CutTheRopeDX.Framework.Visual;

namespace CutTheRopeDX.GameMain
{
    internal static class previewstars
    {
        internal static int grade(int collected, int total)
        {
            return Math.Clamp(collected, 0, 3);
        }

        internal static string message(int collected)
        {
            if (collected >= 10) return "Star Overload!!!";
            return Application.GetString("LEVEL_CLEARED" + (Math.Clamp(collected, 0, 3) + 1));
        }
    }

    /*//////////////////////////////////////////////////////////////////////*/

    internal sealed partial class GameScene
    {
        internal int previewtotalstars { get; private set; }
        private Text previewextra;

        private void previewstartext()
        {
            if (previewextra == null) return;
            previewextra.SetString(starsCollected > 3 ? "+" + (starsCollected - 3) : "");
            float scale = Math.Min(ContentScale * 0.6f, SCREEN_WIDTH * 0.25f / Math.Max(1f, previewextra.width));
            previewextra.scaleX = previewextra.scaleY = scale;
            previewextra.x = hudStar.Length * hudStarSlotWidth * Math.Min(ContentScale, SCREEN_WIDTH * 0.65f / Math.Max(1, hudStar.Length * hudStarSlotWidth)) + previewextra.width * scale / 2f;
            previewextra.y = hudStarSlotHeight * ContentScale / 2f;
        }

        private void previewstarcount(int total)
        {
            previewtotalstars = Math.Max(0, total);
            int count = CustomLevelSession.IsActive ? Math.Min(3, previewtotalstars) : 3;
            if (count != hudStar.Length)
            {
                foreach (Animation star in hudStar) RemoveChild(star);
                hudStar = new Animation[count];
                for (int index = 0; index < count; index++)
                {
                    Animation star = Image.InitializeFromResource(new Animation(), Resources.Img.HudUi);
                    star.SetDrawQuad(1);
                    _ = star.AddAnimationDelayLoopFirstLast(0.05f, Timeline.LoopType.TIMELINE_NO_LOOP, 1, 11);
                    star.SetPauseAtIndexforAnimation(10, 0);
                    star.anchor = 18;
                    hudStar[index] = star;
                    _ = AddChild(star);
                }
            }
            if (previewextra == null)
            {
                previewextra = Text.CreateWithFontandString(Resources.Fnt.BigFont, "");
                previewextra.anchor = 18;
                _ = AddChild(previewextra);
            }
            previewextra.SetString("");
            RelayoutHud();
        }
    }

    /*//////////////////////////////////////////////////////////////////////*/

    internal sealed partial class BoxOpenClose
    {
        private readonly List<Image> previewresultstars = [];
        private Text previewextra;

        internal void previewstarcount(int collected, int total)
        {
            Image first = (Image)result.GetChildWithName("star1");
            Image last = (Image)result.GetChildWithName("star3");
            float center = (first.x + last.x) / 2f;
            float span = Math.Abs(last.x - first.x) + first.width;
            float top = first.y;
            for (int index = 1; index <= 3; index++) result.GetChildWithName("star" + index).visible = false;
            foreach (Image star in previewresultstars) result.RemoveChild(star);
            previewresultstars.Clear();
            int count = Math.Clamp(Math.Max(collected, total), 0, 3);
            float scale = Math.Min(1f, span / Math.Max(1f, count * first.width + Math.Max(0, count - 1) * 12f));
            float step = (first.width + 12f) * scale;
            for (int index = 0; index < count; index++)
            {
                Image star = Image.FromResource(Resources.Img.MenuResults, index < collected ? 13 : 14);
                star.anchor = 18;
                star.x = center + (index - (count - 1) / 2f) * step;
                star.y = top;
                star.scaleX = star.scaleY = scale;
                if (count == 3)
                {
                    Image original = (Image)result.GetChildWithName("star" + (index + 1));
                    star.x = original.x;
                    star.y = original.y;
                    star.scaleX = star.scaleY = 1f;
                }
                star.SetName("previewstar" + index);
                AddPanelPiece(star);
                previewresultstars.Add(star);
            }
            if (previewextra == null)
            {
                previewextra = Text.CreateWithFontandString(Resources.Fnt.BigFont, "");
                previewextra.anchor = 18;
                previewextra.SetName("previewextra");
                AddPanelPiece(previewextra);
            }
            previewextra.SetString(collected > 3 ? "+" + (collected - 3) : "");
            previewextra.scaleX = previewextra.scaleY = Math.Min(0.65f, span * 0.35f / Math.Max(1f, previewextra.width));
            previewextra.x = last.x + last.width / 2f + 12f + previewextra.width * previewextra.scaleX / 2f;
            previewextra.y = top;
        }
    }
}
