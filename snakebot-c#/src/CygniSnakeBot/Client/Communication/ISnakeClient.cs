using System;
using CygniSnakeBot.Client.Events;

namespace CygniSnakeBot.Client.Communication
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

        string GameMode { get; }
        void StartGame(string gameId, string playerId);
        void IssueMovementCommand(MovementDirection direction, long gameTick);
        void RegisterPlayer(string playerName, string playerColor);
        void Connect();
    }
}