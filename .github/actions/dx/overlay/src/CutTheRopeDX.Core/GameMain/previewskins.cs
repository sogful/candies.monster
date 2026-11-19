using CutTheRopeDX.Framework;
using CutTheRopeDX.Framework.Core;
using CutTheRopeDX.Framework.Helpers;
using CutTheRopeDX.Framework.Visual;

namespace CutTheRopeDX.GameMain
{
    internal sealed partial class GameScene
    {
        internal void refreshcandy(string previous, string selected)
        {
            Texture2D original = Application.GetTexture(previous);
            Texture2D replacement = Application.GetTexture(selected);
            foreach (CandyContext candy in candies)
            {
                reskinbody(candy.WholeBody, original, replacement);
                if (candy.Lifecycle.Split is SplitCandyState split)
                {
                    reskinbody(split.Left.Body, original, replacement);
                    reskinbody(split.Right.Body, original, replacement);
                }
            }
            foreach (Lantern lantern in Lantern.AllLanterns) lantern.refreshcandy(replacement);
        }

        private static void reskinbody(CandyBody body, Texture2D original, Texture2D replacement)
        {
            reskincandy(body.Visual, original, replacement);
            reskincandy(body.Main, original, replacement);
            reskincandy(body.Top, original, replacement);
        }

        private static void reskincandy(Image image, Texture2D original, Texture2D replacement)
        {
            if (image?.texture != original) return;
            replaceskintexture(image, replacement, image.quadToDraw);
        }

        internal static void replaceskintexture(Image image, Texture2D replacement, int quad)
        {
            if (quad >= replacement.quadsCount) return;
            image.InitWithTexture(replacement);
            if (quad >= 0) image.SetDrawQuad(quad);
            else image.SetDrawFullImage();
            image.DoRestoreCutTransparency();
        }

        internal void refreshomnom()
        {
            foreach (TargetContext target in targets)
            {
                if (target.previewtype >= 1 && target.previewtype <= OmNomSkinRegistry.TotalSkinCount) continue;
                ITargetAnimationBackend animation = TargetAnimationBackendFactory.CreateForTarget(
                    target.previewtype, nightLevel, SpecialEvents.IsXmas, isExperiments: MenuTheme.IsExperiments);
                GameObject previous = target.targetObject;
                GameObject replacement = animation.TargetObject;
                replacement.x = previous.x;
                replacement.y = previous.y;
                replacement.rotation = previous.rotation;
                replacement.visible = previous.visible;
                replacement.color = previous.color;
                replacement.bb = previous.bb;
                replacement.bb.x += (replacement.width >> 1) - (previous.width >> 1);
                replacement.bb.y += (replacement.height >> 1) - (previous.height >> 1);
                target.baseScaleX = replacement.scaleX = animation.GetTargetBaseScaleX();
                target.baseScaleY = replacement.scaleY = animation.GetTargetBaseScaleY();
                animation.Initialize(this);
                if (target.Feeding.IsAsleep || !target.NightSleep.IsAwake)
                {
                    animation.PlaySleeping(trimIdleToSleepTransition: true);
                    animation.SetSleepOverlayVisible(target.Feeding.IsAsleep || target.NightSleep.OverlayVisible);
                    animation.SyncSleepOverlayPosition(replacement.x, replacement.y);
                }
                else
                {
                    TargetAnimationState state = target.Feeding.Phase switch
                    {
                        TargetFeedingPhase.Chewing => TargetAnimationState.Chewing,
                        TargetFeedingPhase.MouthOpen => TargetAnimationState.MouthOpening,
                        _ => TargetAnimationState.IdleLoop,
                    };
                    animation.Play(state);
                }
                animation.SyncAdditionalOverlayPosition(replacement.x, replacement.y);
                target.animation = animation;
                target.targetObject = replacement;
            }
            if (targets.Count == 0) return;
            targetBaseScaleX = targets[0].baseScaleX;
            targetBaseScaleY = targets[0].baseScaleY;
        }
    }
}
