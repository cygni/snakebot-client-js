using System;
using System.Linq;
using Xunit;

namespace Cygni.Snake.Client.Tests
{
    public class MapUtilsTests
    {
        [Fact]
        public void AllFoodTilesShouldBeReturnedWhenCallingUtilsFunction()
        {
            var map = new Map(5, 5, new SnakeInfo[0], new[] {0, 2, 11, 23, 24}, new int[0]);

            var foodTiles = map.GetFoods().ToList();

            Assert.Equal(foodTiles.Count, 5);
            Assert.Equal(foodTiles.Count(t => t.Y == 0 && t.X == 0), 1);
            Assert.Equal(foodTiles.Count(t => t.Y == 0 && t.X == 2), 1);
            Assert.Equal(foodTiles.Count(t => t.Y == 2 && t.X == 1), 1);
            Assert.Equal(foodTiles.Count(t => t.Y == 4 && t.X == 3), 1);
            Assert.Equal(foodTiles.Count(t => t.Y == 4 && t.X == 4), 1);
        }

        [Fact]
        public void AllObstacleTilesShouldBeReturnedWhenCallingUtilsFunction()
        {
            var map = new Map(5, 5, new SnakeInfo[0], new int[0], new[] {0, 2, 11, 23, 24});

            var obstacleTiles = map.GetObstacles().ToList();

            Assert.Equal(obstacleTiles.Count, 5);
            Assert.Equal(obstacleTiles.Count(t => t.Y == 0 && t.X == 0), 1);
            Assert.Equal(obstacleTiles.Count(t => t.Y == 0 && t.X == 2), 1);
            Assert.Equal(obstacleTiles.Count(t => t.Y == 2 && t.X == 1), 1);
            Assert.Equal(obstacleTiles.Count(t => t.Y == 4 && t.X == 3), 1);
            Assert.Equal(obstacleTiles.Count(t => t.Y == 4 && t.X == 4), 1);
        }

        [Fact]
        public void AllHeadTilesShouldBeReturnedWhenCallingUtilsFunction()
        {
            var map = new Map(5, 5, new[]
            {
                new SnakeInfo(String.Empty, String.Empty, 0, new[] {6}),
                new SnakeInfo(String.Empty, String.Empty, 0, new[] {15}),
                new SnakeInfo(String.Empty, String.Empty, 0, new[] {24}),
            }, new int[0], new int[0]);

            var headTiles = map.GetSnakeHeads().ToList();

            Assert.Equal(headTiles.Count, 3);
            Assert.Equal(headTiles.Count(t => t.Y == 1 && t.X == 1), 1);
            Assert.Equal(headTiles.Count(t => t.Y == 3 && t.X == 0), 1);
            Assert.Equal(headTiles.Count(t => t.Y == 4 && t.X == 4), 1);
        }

        [Fact]
        public void AllBodyTilesShouldBeReturnedWhenCallingUtilsFunction()
        {
            var map = new Map(5, 5, new []
            {
                new SnakeInfo(String.Empty, String.Empty, 0, new []{6,5,4}), 
                new SnakeInfo(String.Empty, String.Empty, 0, new []{15,22}), 
                new SnakeInfo(String.Empty, String.Empty, 0, new []{24}),
            }, new int[0], new int[0]);

            var bodyTiles = map.GetSnakeBodies().ToList();

            Assert.Equal(bodyTiles.Count, 3);
            Assert.Equal(bodyTiles.Count(t => t.Y == 0 && t.X == 4), 1);
            Assert.Equal(bodyTiles.Count(t => t.Y == 1 && t.X == 0), 1);
            Assert.Equal(bodyTiles.Count(t => t.Y == 4 && t.X == 2), 1);
        }

        [Fact]
        public void AllSnakePartTilesShouldBeReturnedWhenCallingUtilsFunction()
        {
            var map = new Map(5, 5, new[]
            {
                new SnakeInfo(String.Empty, String.Empty, 0, new[] {4}),
                new SnakeInfo(String.Empty, String.Empty, 0, new[] {6, 5}),
                new SnakeInfo(String.Empty, String.Empty, 0, new[] {15}),
                new SnakeInfo(String.Empty, String.Empty, 0, new[] {22}),
                new SnakeInfo(String.Empty, String.Empty, 0, new[] {24}),
            }, new[] {0, 2}, new int[0]);

            var snakeTiles = map.GetSnakeParts().ToList();

            Assert.Equal(snakeTiles.Count, 6);
            Assert.Equal(snakeTiles.Count(t => t.Y == 0 && t.X == 4), 1);
            Assert.Equal(snakeTiles.Count(t => t.Y == 1 && t.X == 0), 1);
            Assert.Equal(snakeTiles.Count(t => t.Y == 4 && t.X == 2), 1);
            Assert.Equal(snakeTiles.Count(t => t.Y == 1 && t.X == 1), 1);
            Assert.Equal(snakeTiles.Count(t => t.Y == 3 && t.X == 0), 1);
            Assert.Equal(snakeTiles.Count(t => t.Y == 4 && t.X == 4), 1);
        }

        [Fact]
        public void SnakeSpreadReturnsCorrectSpread()
        {
            var map = new Map(5, 5, new[]
            {
                new SnakeInfo("bestsnake", String.Empty, 0, new[] {0, 5, 6, 11}),
                new SnakeInfo("bestsnake", String.Empty, 0, new[] {4}),
                new SnakeInfo("bestsnake", String.Empty, 0, new[] {15}),
                new SnakeInfo("bestsnake", String.Empty, 0, new[] {22}),
                new SnakeInfo("bestsnake", String.Empty, 0, new[] {24}),
            }, new int[0], new int[0]); 

            var spreadTiles = map.GetSnakeSpread("bestsnake").ToList();

            Assert.Equal(spreadTiles.Count, 4);
            var head = spreadTiles.ElementAt(0);
            Assert.Equal(head.X, 0);
            Assert.Equal(head.Y, 0);

            var body1 = spreadTiles.ElementAt(1);
            Assert.Equal(body1.Y, 1);
            Assert.Equal(body1.X, 0);

            var body2 = spreadTiles.ElementAt(2);
            Assert.Equal(body2.Y, 1);
            Assert.Equal(body2.X, 1);

            var body3 = spreadTiles.ElementAt(3);
            Assert.Equal(body3.Y, 2);
            Assert.Equal(body3.X, 1);
        }

        [Fact]
        public void ResultOfDirectionIsCorrectWhenCallingUtilFunction()
        {
            var map = new Map(5, 5, new[]
            {
                new SnakeInfo("bestsnake", String.Empty, 0, new[] {0, 5, 6, 11}),
                new SnakeInfo(String.Empty, String.Empty, 0, new[] {4}),
                new SnakeInfo(String.Empty, String.Empty, 0, new[] {15}),
                new SnakeInfo(String.Empty, String.Empty, 0, new[] {22}),
                new SnakeInfo(String.Empty, String.Empty, 0, new[] {24}),
            }, new[] {1, 2, 23}, new int[0]);

            Assert.Equal(map.GetResultOfDirection("bestsnake", MovementDirection.Up), DirectionalResult.Death);
            Assert.Equal(map.GetResultOfDirection("bestsnake", MovementDirection.Right), DirectionalResult.Points);
            Assert.Equal(map.GetResultOfDirection("bestsnake", MovementDirection.Left), DirectionalResult.Death);
            Assert.Equal(map.GetResultOfDirection("bestsnake", MovementDirection.Down), DirectionalResult.Death);
        }

        [Fact]
        public void AbleToUseDirectionReturnsValidResult()
        {
            var map = new Map(5, 5, new[]
            {
                new SnakeInfo("bestsnake", String.Empty, 0, new[] {0, 5, 6, 11}),
                new SnakeInfo(String.Empty, String.Empty, 0, new[] {4}),
                new SnakeInfo(String.Empty, String.Empty, 0, new[] {15}),
                new SnakeInfo(String.Empty, String.Empty, 0, new[] {22}),
                new SnakeInfo(String.Empty, String.Empty, 0, new[] {24}),
            }, new[] { 1, 2, 23 }, new int[0]);

            Assert.False(map.AbleToUseDirection("bestsnake", MovementDirection.Up));
            Assert.True(map.AbleToUseDirection("bestsnake", MovementDirection.Right));
            Assert.False(map.AbleToUseDirection("bestsnake", MovementDirection.Left));
            Assert.False(map.AbleToUseDirection("bestsnake", MovementDirection.Down));
        }
    }
}
