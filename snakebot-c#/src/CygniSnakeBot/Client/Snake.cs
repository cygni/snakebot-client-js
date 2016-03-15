using System;
using System.Collections.Generic;
using CygniSnakeBot.Client.Communication;
using CygniSnakeBot.Client.Events;

namespace CygniSnakeBot.Client
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
        private readonly IList<PlayerInfo> _playerInfos = new List<PlayerInfo>();

        protected Snake(string name, string color, ISnakeClient client)
        {
            Name = name;
            Color = color;
            _client = client;

            _client.OnConnected += ClientOnOnConnected;
            _client.OnSessionClosed += ClientOnOnSessionClosed;
            _client.OnPlayerRegistered += ClientOnOnPlayerRegistered;
            _client.OnInvalidPlayerName += ClientOnOnInvalidPlayerName;
            _client.OnGameStarting += ClientOnOnGameStarting;
            _client.OnGameEnded += ClientOnOnGameEnded;
            _client.OnMapUpdate += ClientOnOnMapUpdate;
        }

        protected virtual void ClientOnOnConnected(object sender, EventArgs eventArgs)
        {
            _client.RegisterPlayer(Name, Color);
        }

        protected virtual void ClientOnOnSessionClosed(object sender, EventArgs eventArgs)
        {
            IsPlaying = false;
        }

        protected virtual void ClientOnOnGameStarting(object sender, GameStartingEventArgs gameStartingEventArgs)
        {
            IsPlaying = true;
        }

        protected virtual void ClientOnOnGameEnded(object sender, GameEndedEventArgs gameEndedEventArgs)
        {
            ConsoleMapPrinter.Printer(gameEndedEventArgs.Map, _playerInfos);
            IsPlaying = false;
        }

        private void ClientOnOnMapUpdate(object sender, MapUpdateEventArgs mapUpdateEventArgs)
        {
            _gameTick = mapUpdateEventArgs.GameTick;
            
            var direction = OnGameTurn(mapUpdateEventArgs.Map, _gameTick);

            _client.IssueMovementCommand(direction, _gameTick);
        }

        protected virtual void ClientOnOnPlayerRegistered(object sender, PlayerRegisteredEventArgs playerRegisteredEventArgs)
        {
            _playerInfos.Add(new PlayerInfo(playerRegisteredEventArgs.ReceivingPlayerId, playerRegisteredEventArgs.Color));
            _client.StartGame(playerRegisteredEventArgs.GameId, playerRegisteredEventArgs.ReceivingPlayerId);
        }

        protected virtual void ClientOnOnInvalidPlayerName(object sender, InvalidPlayerNameEventArgs invalidPlayerNameEventArgs)
        {
            var reason = Enum.GetName(typeof (PlayerNameInvalidReason), invalidPlayerNameEventArgs.ReasonCode);

            throw new InvalidOperationException($"Player name is invalid (reason: {reason})");
        }

        protected abstract MovementDirection OnGameTurn(Map map, long gameTick);
    }
}