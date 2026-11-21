using System.Linq;
using System.Xml.Linq;
using CutTheRopeDX.GameMain;
using Xunit;

namespace CutTheRopeDX.Tests
{
    public sealed class previewtargetskins
    {
        [Theory]
        [InlineData(null, false, false)]
        [InlineData("OM_NOM_ORIGINAL_FLASH", true, false)]
        [InlineData("OM_NOM_PREHISTORIC", true, true)]
        public void targetatlases(string skin, bool smooth, bool prehistoric)
        {
            int targettype = skin == null ? 1 : Enumerable.Range(1, OmNomSkinRegistry.XmlSkins.Count)
                .Single(slot => OmNomSkinRegistry.GetXmlSkinDefinition(slot).Id == skin) + 1;
            XElement map = new("map", new XElement("layer", new XElement("target", new XAttribute("targetType", targettype))));
            string[] resources = LevelResourceScanner.GetRequiredResources(map, 0);
            Assert.Equal(smooth, resources.Contains(Resources.Img.CharAnimationsSmooth));
            Assert.Equal(prehistoric, resources.Contains(Resources.Img.CharAnimationsPrehistoric));
        }
    }
}
