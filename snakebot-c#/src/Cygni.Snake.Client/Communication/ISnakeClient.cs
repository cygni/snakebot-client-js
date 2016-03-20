using System;
using Cygni.Snake.Client.Events;

namespace Cygni.Snake.Client.Communication
{
    public interface ISnakeClient
    {
        Action<SnakeDead> OnSnakeDead { set; }
        Action<GameEnded> OnGameEnded { set; }
        Action<GameStarting> OnGameStarting { set; }
        Action<PlayerRegistered> OnPlayerRegistered { set; }
        Action<InvalidPlayerName> OnInvalidPlayerName { set; }
        Action<MapUpdate> OnMapUpdate { set; } 
        Action OnConnected { set; }
        Action OnSessionClosed { set; }

        string GameMode { get; }
        void StartGame(string gameId, string playerId);
        void IssueMovementCommand(MovementDirection direction, long gameTick);
        void RegisterPlayer(string playerName, string playerColor);
        void Connect();
    }
}