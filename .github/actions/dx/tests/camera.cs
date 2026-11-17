using System;
using System.Reflection;
using System.Collections.Generic;
using System.Xml.Linq;
using CutTheRopeDX.Framework;
using CutTheRopeDX.Framework.Helpers;
using CutTheRopeDX.Framework.Platform;
using CutTheRopeDX.GameMain;
using Xunit;

namespace CutTheRopeDX.Tests
{
    public sealed class previewcamera
    {
        [Theory]
        [InlineData(1280, 720)]
        [InlineData(1024, 768)]
        [InlineData(720, 1280)]
        public void worldheightstaysconstant(int width, int height)
        {
            _ = HeadlessGame.Boot();
            CustomLevelSession.Activate("preview.xml");
            try
            {
                LayoutSurfaces.WithSurface(width, height, () =>
                {
                    XElement map = XElement.Parse("<map><layer name='settings'><map width='853' height='480' gridSize='32'/><gameDesign ropePhysicsSpeed='1'/></layer><layer name='Objects'><candy x='700' y='100'/><target x='700' y='430'/><bouncer1 x='6' y='-17' angle='0' size='1' path='' moveLength='0' moveVertical='false' moveOffset='0' moveSpeed='0'/><bouncer1 x='836' y='506' angle='0' size='1' path='' moveLength='0' moveVertical='false' moveOffset='0' moveSpeed='0'/></layer></map>");
                    GameScene scene = HeadlessGame.LoadScenarioMap(map);
                    Camera2D camera = (Camera2D)typeof(GameScene).GetField("camera", BindingFlags.Instance | BindingFlags.NonPublic).GetValue(scene);
                    float worldheight = ScreenPresentation.Instance.Snapshot.VisibleBounds.h / camera.Scale;
                    Assert.Equal(1440f, worldheight, 0.01);
                    Rectangle bounds = (Rectangle)typeof(GameScene).GetField("cameraBounds", BindingFlags.Instance | BindingFlags.NonPublic).GetValue(scene);
                    Assert.Equal(2559f, bounds.w, 0.01);
                    Assert.Equal(1440f, bounds.h, 0.01);
                    Rectangle window = (Rectangle)typeof(GameScene).GetField("cameraWindow", BindingFlags.Instance | BindingFlags.NonPublic).GetValue(scene);
                    MethodInfo tracking = typeof(GameScene).GetMethod("UpdateCameraTracking", BindingFlags.Instance | BindingFlags.NonPublic);
                    for (int frame = 0; frame < 600; frame++) _ = tracking.Invoke(scene, [1f / 60f]);
                    float maximum = MathF.Max(0f, bounds.w - window.w);
                    float expected = Math.Clamp(2100f - window.w / 2f, 0f, maximum);
                    Assert.Equal(expected, camera.RenderPos.X, 1f);
                    if (width == 1280)
                    {
                        float start = camera.RenderPos.X;
                        MethodInfo apply = typeof(GameScene).GetMethod("ApplyCameraFit", BindingFlags.Instance | BindingFlags.NonPublic);
                        camera.MoveToXYImmediate(2000f, 0f, true);
                        _ = apply.Invoke(scene, [ScreenPresentation.Instance.Snapshot]);
                        Assert.Equal(start, camera.RenderPos.X, 0.01);
                    }
                });
            }
            finally {CustomLevelSession.Clear();}
        }
        [Theory]
        [InlineData(1280, 720)]
        [InlineData(1024, 768)]
        [InlineData(720, 1280)]
        public void followsremainingcandy(int width, int height)
        {
            _ = HeadlessGame.Boot();
            CustomLevelSession.Activate("preview.xml");
            try
            {
                LayoutSurfaces.WithSurface(width, height, () =>
                {
                    XElement map = XElement.Parse("<map><layer name='settings'><map width='2000' height='480' gridSize='32'/><gameDesign ropePhysicsSpeed='1'/></layer><layer name='Objects'><candy x='100' y='100'/><candy x='1500' y='100'/><target x='1800' y='430'/></layer></map>");
                    GameScene scene = HeadlessGame.LoadScenarioMap(map);
                    var flags = BindingFlags.Instance | BindingFlags.NonPublic;
                    var candies = (List<CandyContext>)typeof(GameScene).GetField("candies", flags).GetValue(scene);
                    var focus = typeof(GameScene).GetMethod("CameraFocusPoint", flags);
                    var tracking = typeof(GameScene).GetMethod("UpdateCameraTracking", flags);
                    var camera = (Camera2D)typeof(GameScene).GetField("camera", flags).GetValue(scene);
                    Assert.Equal(2, candies.Count);
                    Assert.Same(candies[0].WholeBody.Point, focus.Invoke(scene, null));
                    var transport = CandyTransportSession.ForBamboo(candies[0], null);
                    Assert.True(candies[0].Lifecycle.TryHide(transport, out _));
                    Assert.Same(candies[0].WholeBody.Point, focus.Invoke(scene, null));
                    Assert.True(candies[0].Lifecycle.TryCompleteTransport(transport));
                    Assert.True(candies[0].Lifecycle.TryRemove(CandyRemovalReason.Eaten, out _));
                    Assert.Same(candies[1].WholeBody.Point, focus.Invoke(scene, null));
                    for (int frame = 0; frame < 600; frame++) _ = tracking.Invoke(scene, [1f / 60f]);
                    Rectangle bounds = (Rectangle)typeof(GameScene).GetField("cameraBounds", flags).GetValue(scene);
                    Rectangle window = (Rectangle)typeof(GameScene).GetField("cameraWindow", flags).GetValue(scene);
                    float expected = Math.Clamp(candies[1].WholeBody.Point.pos.X - window.w / 2f, 0f, MathF.Max(0f, bounds.w - window.w));
                    Assert.Equal(expected, camera.RenderPos.X, 1f);
                    Assert.True(candies[1].Lifecycle.TryRemove(CandyRemovalReason.Eaten, out _));
                    Assert.Same(candies[0].WholeBody.Point, focus.Invoke(scene, null));
                });
            }
            finally {CustomLevelSession.Clear();}
        }
    }
}
