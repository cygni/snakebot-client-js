using System;
using Cygni.Snake.Client.Events;

namespace Cygni.Snake.Client.Communication
{
    public interface ISnakeClient
    {
        event EventHandler<MapUpdateEventArgs> OnMapUpdate;
        event EventHandler<SnakeDeadEventArgs> OnSnakeDead;
        event EventHandler<GameEndedEventArgs> OnGameEnded;
        event EventHandler<GameStartingEventArgs> OnGameStarting;
        event EventHandler<PlayerRegisteredEventArgs> OnPlayerRegistered;
        event EventHandler<InvalidPlayerNameEventArgs> OnInvalidPlayerName;
        event EventHandler OnConnected;
        event EventHandler OnSessionClosed;

        void StartGame(string gameId, string playerId);
        void IssueMovementCommand(MovementDirection direction, long gameTick);
        void RegisterPlayer(string playerName, string playerColor);
        void Connect();
    }
}