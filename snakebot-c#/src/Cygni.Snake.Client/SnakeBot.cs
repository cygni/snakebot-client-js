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

        private readonly ISnakeClient _client;
        protected readonly ConsoleMapPrinter Printer;

        protected SnakeBot(string name, ISnakeClient client)
        {
            Name = name;
            _client = client;
            Printer = new ConsoleMapPrinter();
            Printer.Start();

            _client.OnSessionClosed(OnSessionClosed);
            _client.OnPlayerRegistered(OnPlayerRegistered);
            _client.OnInvalidPlayerName(OnInvalidPlayerName);
            _client.OnGameStarting(OnGameStarting);
            _client.OnGameEnded(OnGameEnded);
            _client.OnMapUpdate(OnMapUpdate);
            _client.OnSnakeDead(OnSnakeDead);
        }

        private void OnSnakeDead(SnakeDead snakeDead)
        {
            if (PlayerId == snakeDead.PlayerId)
                IsPlaying = false;

            Printer.Enque(snakeDead);
        }

        public void Start()
        {
            _client.RegisterPlayer(Name);
        }

        protected virtual void OnSessionClosed()
        {
            IsPlaying = false;
        }

        protected virtual void OnGameStarting(GameStarting gameStarting)
        {
            GameRunning = true;
        }

        protected virtual void OnGameEnded(GameEnded gameEnded)
        {
            Printer.Enque(gameEnded);
            GameRunning = false;
        }

        private void OnMapUpdate(MapUpdate mapUpdate)
        {
            long gameTick = mapUpdate.GameTick;
            var direction = OnGameTurn(mapUpdate.Map, gameTick);

            _client.IssueMovementCommand(direction, gameTick);
        }

        protected virtual void OnPlayerRegistered(PlayerRegistered playerRegistered)
        {
            PlayerId = playerRegistered.ReceivingPlayerId;
            IsPlaying = true;
            _client.StartGame();
        }

        protected virtual void OnInvalidPlayerName(InvalidPlayerName invalidPlayerName)
        {
            var reason = Enum.GetName(typeof (PlayerNameInvalidReason), invalidPlayerName.ReasonCode);

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
                Printer?.Close();
            }
        }
    }
}