using System.Collections.Generic;
using Xunit;
using CygniSnakeBot.Client;
using CygniSnakeBot.Client.Communication;
using CygniSnakeBot.Client.Events;
using CygniSnakeBot.Client.Tiles;
using Moq;

namespace CygniSnakeBot.tests
{
    public class SnakeTests
    {
        [Fact]
        public void SnakeShouldNotStartGameIfGameModeIsNotTraining()
        {
            var _clientMock = new Mock<ISnakeClient>();
            _clientMock.SetupGet(m => m.GameMode).Returns("tournament");
            new MySnake("supersnake", "black", _clientMock.Object);
            
            _clientMock.Raise(m => m.OnPlayerRegistered += null, new PlayerRegisteredEventArgs("supersnake", "black", new GameSettings(), "tournament", "", ""));

            _clientMock.Verify(m => m.StartGame(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }


        [Fact]
        public void SnakeShouldStartGameIfGameModeIsTraining()
        {
            var _clientMock = new Mock<ISnakeClient>();
            _clientMock.SetupGet(m => m.GameMode).Returns("training");
            new MySnake("supersnake", "black", _clientMock.Object);

            _clientMock.Raise(m => m.OnPlayerRegistered += null, new PlayerRegisteredEventArgs("supersnake", "black", new GameSettings(), "training", "", ""));

            _clientMock.Verify(m => m.StartGame(It.IsAny<string>(), It.IsAny<string>()), Times.Once);
        }

        [Fact]
        public void SnakeShouldRespondWithNewMovementDirectionWhenMapIsUpdated()
        {
            var _clientMock = new Mock<ISnakeClient>();
            new MySnake("supersnake", "black", _clientMock.Object);

            _clientMock.Raise(m => m.OnMapUpdate += null, new MapUpdateEventArgs("","",1337, new Map(0, 0, new List<IEnumerable<ITileContent>>(), new List<SnakeInfo>())));
            
            _clientMock.Verify(m => m.IssueMovementCommand(It.IsAny<MovementDirection>(), 1337), Times.Once);
        }
    }
}