using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Cygni.Snake.Client;
using Cygni.Snake.Client.Tiles;
using Cygni.Snake.Client.Utils;
using Xunit;

namespace CygniSnakeBot.tests
{
    public class MapUtilsTests
    {
        [Fact]
        public void AllFoodTilesShouldBeReturnedWhenCallingUtilsFunction()
        {
            var map = new Map(0, 0,
                new List<IEnumerable<ITileContent>>()
                {
                    new List<ITileContent>() {new FoodTile(), new EmptyTile(), new FoodTile(), new EmptyTile(), new EmptyTile() }, //Column 0
                    new List<ITileContent>() {new EmptyTile(), new EmptyTile(), new EmptyTile(), new EmptyTile(), new EmptyTile() }, //Column 1
                    new List<ITileContent>() {new EmptyTile(), new FoodTile(), new EmptyTile(), new EmptyTile(), new EmptyTile() }, //Column 2
                    new List<ITileContent>() {new EmptyTile(), new EmptyTile(), new EmptyTile(), new EmptyTile(), new EmptyTile() }, //Column 3
                    new List<ITileContent>() {new EmptyTile(), new EmptyTile(), new EmptyTile(), new FoodTile(), new FoodTile() }  //Column 4
                }, null);

            var foodTiles = map.GetFoods().ToList();

            Assert.Equal(foodTiles.Count(), 5);
            Assert.Equal(foodTiles.Count(t => t.X == 0 && t.Y == 0), 1);
            Assert.Equal(foodTiles.Count(t => t.X == 0 && t.Y == 2), 1);
            Assert.Equal(foodTiles.Count(t => t.X == 2 && t.Y == 1), 1);
            Assert.Equal(foodTiles.Count(t => t.X == 4 && t.Y == 3), 1);
            Assert.Equal(foodTiles.Count(t => t.X == 4 && t.Y == 4), 1);
        }

        [Fact]
        public void AllObstacleTilesShouldBeReturnedWhenCallingUtilsFunction()
        {
            var map = new Map(0, 0,
                new List<IEnumerable<ITileContent>>()
                {
                    new List<ITileContent>() {new ObstacleTile(), new EmptyTile(), new ObstacleTile(), new EmptyTile(), new EmptyTile() }, //Column 0
                    new List<ITileContent>() {new EmptyTile(), new EmptyTile(), new EmptyTile(), new EmptyTile(), new EmptyTile() }, //Column 1
                    new List<ITileContent>() {new EmptyTile(), new ObstacleTile(), new EmptyTile(), new EmptyTile(), new EmptyTile() }, //Column 2
                    new List<ITileContent>() {new EmptyTile(), new EmptyTile(), new EmptyTile(), new EmptyTile(), new EmptyTile() }, //Column 3
                    new List<ITileContent>() {new EmptyTile(), new EmptyTile(), new EmptyTile(), new ObstacleTile(), new ObstacleTile() }  //Column 4
                }, null);

            var obstacleTiles = map.GetObstacles().ToList();

            Assert.Equal(obstacleTiles.Count(), 5);
            Assert.Equal(obstacleTiles.Count(t => t.X == 0 && t.Y == 0), 1);
            Assert.Equal(obstacleTiles.Count(t => t.X == 0 && t.Y == 2), 1);
            Assert.Equal(obstacleTiles.Count(t => t.X == 2 && t.Y == 1), 1);
            Assert.Equal(obstacleTiles.Count(t => t.X == 4 && t.Y == 3), 1);
            Assert.Equal(obstacleTiles.Count(t => t.X == 4 && t.Y == 4), 1);
        }

        [Fact]
        public void AllHeadTilesShouldBeReturnedWhenCallingUtilsFunction()
        {
            var map = new Map(0, 0,
                new List<IEnumerable<ITileContent>>()
                {
                    new List<ITileContent>() {new FoodTile(), new EmptyTile(), new FoodTile(), new EmptyTile(), new EmptyTile() }, //Column 0
                    new List<ITileContent>() {new EmptyTile(), new SnakeHeadTile(string.Empty, string.Empty), new EmptyTile(), new EmptyTile(), new EmptyTile() }, //Column 1
                    new List<ITileContent>() {new EmptyTile(), new FoodTile(), new EmptyTile(), new EmptyTile(), new EmptyTile() }, //Column 2
                    new List<ITileContent>() {new SnakeHeadTile(string.Empty, string.Empty), new EmptyTile(), new EmptyTile(), new EmptyTile(), new EmptyTile() }, //Column 3
                    new List<ITileContent>() {new EmptyTile(), new EmptyTile(), new EmptyTile(), new FoodTile(), new SnakeHeadTile(string.Empty, string.Empty) }  //Column 4
                }, null);

            var headTiles = map.GetSnakeHeads().ToList();

            Assert.Equal(headTiles.Count(), 3);
            Assert.Equal(headTiles.Count(t => t.X == 1 && t.Y == 1), 1);
            Assert.Equal(headTiles.Count(t => t.X == 3 && t.Y == 0), 1);
            Assert.Equal(headTiles.Count(t => t.X == 4 && t.Y == 4), 1);
        }

        [Fact]
        public void AllBodyTilesShouldBeReturnedWhenCallingUtilsFunction()
        {
            var map = new Map(0, 0,
                new List<IEnumerable<ITileContent>>()
                {
                    new List<ITileContent>() {new FoodTile(), new EmptyTile(), new FoodTile(), new EmptyTile(), new SnakeBodyTile(string.Empty, 0, false) }, //Column 0
                    new List<ITileContent>() {new SnakeBodyTile(string.Empty, 0, false), new SnakeHeadTile(string.Empty, string.Empty), new EmptyTile(), new EmptyTile(), new EmptyTile() }, //Column 1
                    new List<ITileContent>() {new EmptyTile(), new FoodTile(), new EmptyTile(), new EmptyTile(), new EmptyTile() }, //Column 2
                    new List<ITileContent>() {new SnakeHeadTile(string.Empty, string.Empty), new EmptyTile(), new EmptyTile(), new EmptyTile(), new EmptyTile() }, //Column 3
                    new List<ITileContent>() {new EmptyTile(), new EmptyTile(), new SnakeBodyTile(string.Empty, 0, false), new FoodTile(), new SnakeHeadTile(string.Empty, string.Empty) }  //Column 4
                }, null);

            var bodyTiles = map.GetSnakeBodies().ToList();

            Assert.Equal(bodyTiles.Count(), 3);
            Assert.Equal(bodyTiles.Count(t => t.X == 0 && t.Y == 4), 1);
            Assert.Equal(bodyTiles.Count(t => t.X == 1 && t.Y == 0), 1);
            Assert.Equal(bodyTiles.Count(t => t.X == 4 && t.Y == 2), 1);
        }

        [Fact]
        public void AllSnakePartTilesShouldBeReturnedWhenCallingUtilsFunction()
        {
            var map = new Map(0, 0,
                new List<IEnumerable<ITileContent>>()
                {
                    new List<ITileContent>() {new FoodTile(), new EmptyTile(), new FoodTile(), new EmptyTile(), new SnakeBodyTile(string.Empty, 0, false) }, //Column 0
                    new List<ITileContent>() {new SnakeBodyTile(string.Empty, 0, false), new SnakeHeadTile(string.Empty, string.Empty), new EmptyTile(), new EmptyTile(), new EmptyTile() }, //Column 1
                    new List<ITileContent>() {new EmptyTile(), new FoodTile(), new EmptyTile(), new EmptyTile(), new EmptyTile() }, //Column 2
                    new List<ITileContent>() {new SnakeHeadTile(string.Empty, string.Empty), new EmptyTile(), new EmptyTile(), new EmptyTile(), new EmptyTile() }, //Column 3
                    new List<ITileContent>() {new EmptyTile(), new EmptyTile(), new SnakeBodyTile(string.Empty, 0, false), new FoodTile(), new SnakeHeadTile(string.Empty, string.Empty) }  //Column 4
                }, null);

            var snakeTiles = map.GetSnakeParts().ToList();

            Assert.Equal(snakeTiles.Count(), 6);
            Assert.Equal(snakeTiles.Count(t => t.X == 0 && t.Y == 4), 1);
            Assert.Equal(snakeTiles.Count(t => t.X == 1 && t.Y == 0), 1);
            Assert.Equal(snakeTiles.Count(t => t.X == 4 && t.Y == 2), 1);
            Assert.Equal(snakeTiles.Count(t => t.X == 1 && t.Y == 1), 1);
            Assert.Equal(snakeTiles.Count(t => t.X == 3 && t.Y == 0), 1);
            Assert.Equal(snakeTiles.Count(t => t.X == 4 && t.Y == 4), 1);
        }

        [Fact]
        public void SnakeSpreadReturnsCorrectSpread()
        {
            var map = new Map(0, 0,
                new List<IEnumerable<ITileContent>>()
                {
                    new List<ITileContent>() {new SnakeHeadTile("bestsnake", string.Empty), new EmptyTile(), new FoodTile(), new EmptyTile(), new SnakeBodyTile(string.Empty, 0, false) }, //Column 0
                    new List<ITileContent>() {new SnakeBodyTile("bestsnake", 0, false), new SnakeBodyTile("bestsnake", 1, false), new EmptyTile(), new EmptyTile(), new EmptyTile() }, //Column 1
                    new List<ITileContent>() {new EmptyTile(), new SnakeBodyTile("bestsnake", 2, true), new EmptyTile(), new EmptyTile(), new EmptyTile() }, //Column 2
                    new List<ITileContent>() {new SnakeHeadTile(string.Empty, string.Empty), new EmptyTile(), new EmptyTile(), new EmptyTile(), new EmptyTile() }, //Column 3
                    new List<ITileContent>() {new EmptyTile(), new EmptyTile(), new SnakeBodyTile(string.Empty, 0, false), new FoodTile(), new SnakeHeadTile(string.Empty, string.Empty) }  //Column 4
                }, null);

            var spreadTiles = map.GetSnakeSpread("bestsnake").ToList();

            Assert.Equal(spreadTiles.Count(), 4);
            var head = spreadTiles.ElementAt(0);
            Assert.Equal(head.X, 0);
            Assert.Equal(head.Y, 0);

            var body1 = spreadTiles.ElementAt(1);
            Assert.Equal(body1.X, 1);
            Assert.Equal(body1.Y, 0);
            Assert.Equal((body1.Tile as SnakeBodyTile)?.Order, 0);

            var body2 = spreadTiles.ElementAt(2);
            Assert.Equal(body2.X, 1);
            Assert.Equal(body2.Y, 1);
            Assert.Equal((body2.Tile as SnakeBodyTile)?.Order, 1);

            var body3 = spreadTiles.ElementAt(3);
            Assert.Equal(body3.X, 2);
            Assert.Equal(body3.Y, 1);
            Assert.Equal((body3.Tile as SnakeBodyTile)?.Order, 2);
        }

        [Fact]
        public void ResultOfDirectionIsCorrectWhenCallingUtilFunction()
        {
            var map = new Map(0, 0,
                new List<IEnumerable<ITileContent>>()
                {
                    new List<ITileContent>() {new SnakeHeadTile("bestsnake", string.Empty), new FoodTile(), new FoodTile(), new EmptyTile(), new SnakeBodyTile(string.Empty, 0, false) }, //Column 0
                    new List<ITileContent>() {new SnakeBodyTile("bestsnake", 0, false), new SnakeBodyTile("bestsnake", 1, false), new EmptyTile(), new EmptyTile(), new EmptyTile() }, //Column 1
                    new List<ITileContent>() {new EmptyTile(), new SnakeBodyTile("bestsnake", 2, false), new EmptyTile(), new EmptyTile(), new EmptyTile() }, //Column 2
                    new List<ITileContent>() {new SnakeHeadTile(string.Empty, string.Empty), new EmptyTile(), new EmptyTile(), new EmptyTile(), new EmptyTile() }, //Column 3
                    new List<ITileContent>() {new EmptyTile(), new EmptyTile(), new SnakeBodyTile(string.Empty, 0, false), new FoodTile(), new SnakeHeadTile(string.Empty, string.Empty) }  //Column 4
                }, null);

            Assert.Equal(map.GetResultOfDirection("bestsnake", MovementDirection.Up), DirectionalResult.Death);
            Assert.Equal(map.GetResultOfDirection("bestsnake", MovementDirection.Down), DirectionalResult.Points);
            Assert.Equal(map.GetResultOfDirection("bestsnake", MovementDirection.Left), DirectionalResult.Death);
            Assert.Equal(map.GetResultOfDirection("bestsnake", MovementDirection.Right), DirectionalResult.Death);
        }

        [Fact]
        public void AbleToUseDirectionReturnsValidResult()
        {
            var map = new Map(0, 0,
                new List<IEnumerable<ITileContent>>()
                {
                    new List<ITileContent>() {new SnakeHeadTile("bestsnake", string.Empty), new FoodTile(), new FoodTile(), new EmptyTile(), new SnakeBodyTile(string.Empty, 0, false) }, //Column 0
                    new List<ITileContent>() {new SnakeBodyTile("bestsnake", 0, false), new SnakeBodyTile("bestsnake", 1, false), new EmptyTile(), new EmptyTile(), new EmptyTile() }, //Column 1
                    new List<ITileContent>() {new EmptyTile(), new SnakeBodyTile("bestsnake", 2, false), new EmptyTile(), new EmptyTile(), new EmptyTile() }, //Column 2
                    new List<ITileContent>() {new SnakeHeadTile(string.Empty, string.Empty), new EmptyTile(), new EmptyTile(), new EmptyTile(), new EmptyTile() }, //Column 3
                    new List<ITileContent>() {new EmptyTile(), new EmptyTile(), new SnakeBodyTile(string.Empty, 0, false), new FoodTile(), new SnakeHeadTile(string.Empty, string.Empty) }  //Column 4
                }, null);

            Assert.False(map.AbleToUseDirection("bestsnake", MovementDirection.Up));
            Assert.True(map.AbleToUseDirection("bestsnake", MovementDirection.Down));
            Assert.False(map.AbleToUseDirection("bestsnake", MovementDirection.Left));
            Assert.False(map.AbleToUseDirection("bestsnake", MovementDirection.Right));
        }
    }
}
