namespace CygniSnakeBot.Client.Communication.Serialization
{
    public interface IConverter
    {
        string Serialize(object value);
        T Deserialize<T>(string value);
        string GetMessageType(string jsonMessage);
    }
}