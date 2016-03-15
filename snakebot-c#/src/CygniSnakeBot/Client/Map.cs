using System.Collections.Generic;
using CygniSnakeBot.Client.Tiles;

namespace CygniSnakeBot.Client
{
    public class Map
    {
        public int Width { get; }

        public int Height { get; }

        public IEnumerable<IEnumerable<ITileContent>> Tiles { get; }

        public IEnumerable<SnakeInfo> SnakeInfos { get; }

        public Map(int width, int height, IEnumerable<IEnumerable<ITileContent>> tiles, IEnumerable<SnakeInfo> snakeInfos)
        {
            Width = width;
            Height = height;
            Tiles = tiles;
            SnakeInfos = snakeInfos;
        }
    }
}