using System;
using System.Collections.Generic;
using Cygni.Snake.Client.Communication;
using Cygni.Snake.Client.Events;

namespace Cygni.Snake.Client
{
    /// <summary>
    /// A skeleton class to help create snakes.
    /// </summary>
    public abstract class Snake
    {
        public string Name { get; }
        public string Color { get; }
        public bool IsPlaying { get; private set; }
        
        private readonly ISnakeClient _client;
        private long _gameTick;

        protected readonly IList<PlayerInfo> PlayerInfos = new List<PlayerInfo>();

        protected Snake(string name, string color, ISnakeClient client)
        {
            Name = name;
            Color = color;
            _client = client;

            _client.OnConnected(OnClientConnected);
            _client.OnSessionClosed(OnSessionClosed);
            _client.OnPlayerRegistered(OnPlayerRegistered);
            _client.OnInvalidPlayerName(OnInvalidPlayerName);
            _client.OnGameStarting(OnGameStarting);
            _client.OnGameEnded(OnGameEnded);
            _client.OnMapUpdate(OnMapUpdate);
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
            IsPlaying = true;
        }

        protected virtual void OnGameEnded(GameEnded gameEnded)
        {
            ConsoleMapPrinter.Printer(gameEnded.Map, PlayerInfos);
            IsPlaying = false;
        }

        private void OnMapUpdate(MapUpdate mapUpdate)
        {
            _gameTick = mapUpdate.GameTick;
            
            var direction = OnGameTurn(mapUpdate.Map, _gameTick);

            _client.IssueMovementCommand(direction, _gameTick);
        }

        protected virtual void OnPlayerRegistered(PlayerRegistered playerRegistered)
        {
            PlayerInfos.Add(new PlayerInfo(playerRegistered.ReceivingPlayerId, playerRegistered.Color));

            if(_client.GameMode == "training")
                _client.StartGame(playerRegistered.GameId, playerRegistered.ReceivingPlayerId);
        }

        protected virtual void OnInvalidPlayerName(InvalidPlayerName invalidPlayerName)
        {
            var reason = Enum.GetName(typeof (PlayerNameInvalidReason), invalidPlayerName.ReasonCode);

            throw new InvalidOperationException($"Player name is invalid (reason: {reason})");
        }

        protected abstract MovementDirection OnGameTurn(Map map, long gameTick);
    }
}