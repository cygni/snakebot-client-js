using System;
using System.Threading.Tasks;
using Cygni.Snake.Client.Events;

namespace Cygni.Snake.Client.Communication
{
    public interface ISnakeClient
    {
        void OnSnakeDead(Action<SnakeDead> onSnakeDead);
        void OnGameEnded(Action<GameEnded> onGameEnded);
        void OnGameStarting(Action<GameStarting> onGameStaring);
        void OnPlayerRegistered(Action<PlayerRegistered> onPlayerRegistered);
        void OnInvalidPlayerName(Action<InvalidPlayerName> onInvalidPlayerName);
        void OnMapUpdate(Action<MapUpdate> onMapUpdate);
        void OnSessionClosed(Action onSessionClosed);
        void StartGame();
        void IssueMovementCommand(Direction direction, long gameTick);
        void RegisterPlayer(string playerName);
    }
}