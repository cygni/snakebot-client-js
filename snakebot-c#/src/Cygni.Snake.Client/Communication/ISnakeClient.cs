using System;
using System.Threading.Tasks;
using Cygni.Snake.Client.Events;

namespace Cygni.Snake.Client.Communication
{
    public interface ISnakeClient
    {
        void StartGame();
        void IssueMovementCommand(Direction direction, long gameTick);
        void RegisterPlayer(string playerName);
    }
}