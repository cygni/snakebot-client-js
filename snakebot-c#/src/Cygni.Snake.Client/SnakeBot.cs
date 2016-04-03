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
        public string Color { get; }
        public bool IsPlaying { get; private set; }
        public string PlayerId { get; private set; }
        public bool GameRunning { get; set; } = true;

        private readonly ISnakeClient _client;
        private long _gameTick;
        protected readonly ConsoleMapPrinter Printer;

        protected SnakeBot(string name, string color, ISnakeClient client)
        {
            Name = name;
            Color = color;
            _client = client;
            Printer = new ConsoleMapPrinter();
            Printer.Start();

            _client.OnConnected(OnClientConnected);
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

        protected virtual void OnClientConnected()
        {
            _client.RegisterPlayer(Name, Color);
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
            _gameTick = mapUpdate.GameTick;
            
            var direction = OnGameTurn(mapUpdate.Map, _gameTick);

            _client.IssueMovementCommand(direction, _gameTick);
        }

        protected virtual void OnPlayerRegistered(PlayerRegistered playerRegistered)
        {
            PlayerId = playerRegistered.ReceivingPlayerId;
            IsPlaying = true;

            if (_client.GameMode == "training")
                _client.StartGame(playerRegistered.GameId, playerRegistered.ReceivingPlayerId);
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