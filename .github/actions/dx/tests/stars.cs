using System;
using System.Reflection;
using System.Linq;
using System.Xml.Linq;
using CutTheRopeDX.Framework.Core;
using CutTheRopeDX.Framework.Visual;
using CutTheRopeDX.GameMain;
using Xunit;

namespace CutTheRopeDX.Tests
{
    public sealed class previewstarcounts
    {
        private sealed class buttons : IButtonDelegation
        {
            public void OnButtonPressed(ButtonId button) { }
        }

        [Theory]
        [InlineData(0, 6, 0)]
        [InlineData(1, 6, 1)]
        [InlineData(3, 6, 2)]
        [InlineData(5, 6, 2)]
        [InlineData(6, 6, 3)]
        [InlineData(1, 1, 3)]
        [InlineData(1, 2, 2)]
        [InlineData(0, 0, 0)]
        [InlineData(1, 3, 1)]
        [InlineData(2, 3, 2)]
        [InlineData(3, 3, 3)]
        public void grading(int collected, int total, int expected)
        {
            Assert.Equal(expected, previewstars.grade(collected, total));
        }

        [Theory]
        [InlineData(0)]
        [InlineData(1)]
        [InlineData(3)]
        [InlineData(8)]
        [InlineData(40)]
        public void allstarsfit(int count)
        {
            _ = HeadlessGame.Boot();
            CustomLevelSession.Activate("stars.xml");
            try
            {
                foreach ((int width, int height) in new[] { (1280, 720), (720, 1280) })
                {
                    LayoutSurfaces.WithSurface(width, height, () =>
                    {
                        XElement map = XElement.Parse("<map><layer name='settings'><map width='853' height='480' gridSize='32'/><gameDesign ropePhysicsSpeed='1'/></layer><layer name='Objects'><candy x='400' y='100'/><target x='400' y='430'/></layer></map>");
                        XElement objects = map.Elements("layer").Last();
                        for (int index = 0; index < count; index++) objects.Add(new XElement("star", new XAttribute("x", 40 + index * 12), new XAttribute("y", 200)));
                        GameScene scene = HeadlessGame.LoadScenarioMap(map);
                        Assert.Equal(count, scene.previewtotalstars);
                        Animation[] stars = (Animation[])typeof(GameScene).GetField("hudStar", BindingFlags.Instance | BindingFlags.NonPublic).GetValue(scene);
                        Assert.Equal(count, stars.Length);
                        if (count > 0) Assert.True(stars[^1].x + stars[^1].width * stars[^1].scaleX / 2f <= CutTheRopeDX.Framework.FrameworkTypes.SCREEN_WIDTH * 0.65f + 1);
                        BoxOpenClose box = new BoxOpenClose().InitWithButtonDelegate(new buttons());
                        box.previewstarcount(count, count);
                        for (int index = 0; index < count; index++)
                        {
                            Image star = (Image)box.result.GetChildWithName("previewstar" + index);
                            Assert.Equal(13, star.quadToDraw);
                            Assert.InRange(star.scaleX, 0.001f, 1f);
                        }
                        box.previewstarcount(0, 1);
                        Assert.Equal(14, ((Image)box.result.GetChildWithName("previewstar0")).quadToDraw);
                        Assert.Null(box.result.GetChildWithName("previewstar1"));
                    });
                }
            }
            finally {CustomLevelSession.Clear();}
        }
    }
}
