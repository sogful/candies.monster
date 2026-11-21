using System.Xml.Linq;
using CutTheRopeDX.GameMain;
using Xunit;

namespace CutTheRopeDX.Tests
{
    public sealed class previewghosts
    {
        [Theory]
        [InlineData("<ghost />", false, false)]
        [InlineData("<ghost bouncer='false' bubble='true' />", false, true)]
        [InlineData("<ghost bouncer='TRUE' grab='true' />", true, false)]
        [InlineData("<ghost bouncer='true' bubble='true' />", true, true)]
        public void apparitionassets(string ghost, bool bouncer, bool bubble)
        {
            XElement map = new("map", new XElement("layer", XElement.Parse(ghost)));
            string[] resources = LevelResourceScanner.GetRequiredResources(map, 0);
            Assert.Contains(Resources.Img.ObjGhost, resources);
            Assert.Contains(Resources.Snd.GhostPuff, resources);
            Assert.Equal(bouncer, System.Array.IndexOf(resources, Resources.Img.ObjBouncer) >= 0);
            Assert.Equal(bouncer, System.Array.IndexOf(resources, Resources.Snd.Bouncer) >= 0);
            Assert.Equal(bubble, System.Array.IndexOf(resources, Resources.Snd.Bubble) >= 0);
            Assert.Equal(bubble, System.Array.IndexOf(resources, Resources.Snd.BubbleBreak) >= 0);
        }
    }
}
