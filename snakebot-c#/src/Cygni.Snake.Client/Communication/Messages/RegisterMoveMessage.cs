namespace Cygni.Snake.Client.Communication.Messages
{
    public class RegisterMoveMessage : GameMessage
    {
        public Direction Direction { get; }

        public long GameTick { get; }

        public override string Type => MessageType.RegisterMove;

        public RegisterMoveMessage(Direction direction, long gameTick, string playerId)
            : base(playerId)
        {
            Direction = direction;
            GameTick = gameTick;
        }
    }
}