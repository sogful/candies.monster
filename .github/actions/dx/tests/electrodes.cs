using System.Xml.Linq;
using CutTheRopeDX.GameMain;
using Xunit;

namespace CutTheRopeDX.Tests
{
    public sealed class previewelectrodes
    {
        [Theory]
        [InlineData("spike1", 1, false)]
        [InlineData("spike4", 5, true)]
        [InlineData("spike1", 5, true)]
        [InlineData("electro", 5, true)]
        public void hazardassets(string tag, int size, bool electrodes)
        {
            XElement map = new("map", new XElement("layer", new XElement(tag, new XAttribute("size", size))));
            string[] resources = LevelResourceScanner.GetRequiredResources(map, 0);
            Assert.Contains(Resources.Img.ObjSpikes, resources);
            Assert.Equal(electrodes, System.Array.IndexOf(resources, Resources.Img.ObjElectrodes) >= 0);
        }
    }
}
