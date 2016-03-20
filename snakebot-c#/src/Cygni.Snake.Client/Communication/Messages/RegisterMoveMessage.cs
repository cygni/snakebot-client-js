namespace Cygni.Snake.Client.Communication.Messages
{
    public class RegisterMoveMessage : GameMessage
    {
        public MovementDirection Direction { get; }

        public long GameTick { get; }

        public override string Type => MessageType.RegisterMove;

        public RegisterMoveMessage(MovementDirection direction, long gameTick, string playerId)
            : base(playerId)
        {
            Direction = direction;
            GameTick = gameTick;
        }
    }
}