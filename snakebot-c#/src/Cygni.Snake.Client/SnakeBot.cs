using System;
using Cygni.Snake.Client.Communication;
using Cygni.Snake.Client.Events;

namespace Cygni.Snake.Client
{
    /// <summary>
    /// A skeleton class to help create snakes.
    /// </summary>
    public abstract class SnakeBot : IDisposable
    {
        public string Name { get; }
        public bool IsPlaying { get; private set; }
        public string PlayerId { get; private set; }
        public bool GameRunning { get; set; } = true;

        protected readonly ConsoleMapPrinter Printer;

        protected SnakeBot(string name, bool print)
        {
            Name = name;
            if (print)
            {
                Printer = new ConsoleMapPrinter();
            }
        }

        protected SnakeBot(string name) : this(name, false) { }

        public virtual void OnSnakeDead(SnakeDead snakeDead)
        {
            if (PlayerId == snakeDead.PlayerId)
                IsPlaying = false;
            Printer?.Enque(snakeDead);
        }

        public virtual void OnGameStarting(GameStarting gameStarting)
        {
            GameRunning = true;
        }

        public virtual void OnGameEnded(GameEnded gameEnded)
        {
            Printer?.Enque(gameEnded);
            GameRunning = false;
        }

        public virtual Direction OnMapUpdate(MapUpdate mapUpdate)
        {
            long gameTick = mapUpdate.GameTick;
            return OnGameTurn(mapUpdate.Map, gameTick);
        }

        public virtual void OnPlayerRegistered(PlayerRegistered playerRegistered)
        {
            PlayerId = playerRegistered.ReceivingPlayerId;
            IsPlaying = true;
        }

        public virtual void OnInvalidPlayerName(InvalidPlayerName invalidPlayerName)
        {
            var reason = Enum.GetName(typeof(PlayerNameInvalidReason), invalidPlayerName.ReasonCode);

            throw new InvalidOperationException($"Player name is invalid (reason: {reason})");
        }

        protected abstract Direction OnGameTurn(Map map, long gameTick);

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                //Printer?.Close();
            }
        }
    }
}