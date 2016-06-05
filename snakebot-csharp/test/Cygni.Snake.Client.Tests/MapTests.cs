//using System;
//using System.Text;
//using Xunit;

//namespace Cygni.Snake.Client.Tests
//{
//    public class MapTests
//    {
//        [Theory]
//        [InlineData(Direction.Up, DirectionalResult.Death)]
//        [InlineData(Direction.Right, DirectionalResult.Points)]
//        [InlineData(Direction.Left, DirectionalResult.Death)]
//        [InlineData(Direction.Down, DirectionalResult.Death)]
//        public void GetResultOfDirection_ReturnsExpectedResult(Direction direction, DirectionalResult result)
//        {
//            var snake = new SnakePlayer("bestsnake", String.Empty, 0, new[]
//            {
//                new MapCoordinate(0, 0),
//                new MapCoordinate(0, 1),
//                new MapCoordinate(1, 1),
//                new MapCoordinate(1, 2)
//            });
//            var map = new Map(5, 5, 1, snake, new[] {snake}, new[] {new MapCoordinate(1, 0)}, new[] {new MapCoordinate(0, 0)});

//            Assert.Equal(result, map.GetResultOfDirection("bestsnake", direction));
//        }

//        [Theory]
//        [InlineData(Direction.Up, false)]
//        [InlineData(Direction.Right, true)]
//        [InlineData(Direction.Left, false)]
//        [InlineData(Direction.Down, false)]
//        public void AbleToUseDirectionReturnsValidResult(Direction direction, bool expectedResult)
//        {
//            var snake = new SnakePlayer("bestsnake", String.Empty, 0, new[]
//            {
//                new MapCoordinate(0, 0),
//                new MapCoordinate(0, 1),
//                new MapCoordinate(1, 1),
//                new MapCoordinate(1, 2)
//            });
//            var map = new Map(5, 5, 1, snake, new[] { snake }, new[] { new MapCoordinate(1, 0) }, new[] { new MapCoordinate(0, 0) });

//            Assert.Equal(expectedResult, map.AbleToUseDirection("bestsnake", direction));
//        }
        
//        [Fact]
//        public void FromJson_ReturnsMapWithCorrectNumberOfPlayers()
//        {
//            var json = TestResources.GetResourceText("map.json", Encoding.UTF8);

//            var map = Map.FromJson(json,"id_python");

//            Assert.Equal(2, map.Snakes.Count);
//        }

//        [Fact]
//        public void FromJson_ReturnsMapWithCorrectSnakePositions()
//        {
//            var json = TestResources.GetResourceText("map.json", Encoding.UTF8);

//            var map = Map.FromJson(json,"id_python");

//            Assert.Equal(2, map.Snakes[0].Positions.Count);
//            Assert.Equal(1, map.Snakes[0].Positions[0].X);
//            Assert.Equal(0, map.Snakes[0].Positions[0].Y);
//            Assert.Equal(0, map.Snakes[0].Positions[1].X);
//            Assert.Equal(0, map.Snakes[0].Positions[1].Y);

//            Assert.Equal(2, map.Snakes[1].Positions.Count);
//            Assert.Equal(0, map.Snakes[1].Positions[0].X);
//            Assert.Equal(1, map.Snakes[1].Positions[0].Y);
//            Assert.Equal(0, map.Snakes[1].Positions[1].X);
//            Assert.Equal(2, map.Snakes[1].Positions[1].Y);
//        }

//        [Fact]
//        public void FromJson_ReturnsMapMySnakeInstance()
//        {
//            var json = TestResources.GetResourceText("map.json", Encoding.UTF8);

//            var map = Map.FromJson(json,"id_python");
            
//            Assert.Equal("id_python", map.MySnake.Id);
//        }
//    }
//}
