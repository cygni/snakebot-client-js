using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace CygniSnakeBot.Client.Communication.Serialization
{
    public class MovementDirectionConverter : Newtonsoft.Json.JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            switch ((MovementDirection)value)
            {
                case MovementDirection.Up:
                    JToken.FromObject("UP").WriteTo(writer);
                    return;
                case MovementDirection.Down:
                    JToken.FromObject("DOWN").WriteTo(writer);
                    return;
                case MovementDirection.Left:
                    JToken.FromObject("LEFT").WriteTo(writer);
                    return;
                case MovementDirection.Right:
                    JToken.FromObject("RIGHT").WriteTo(writer);
                    return;
                default:
                    throw new ArgumentOutOfRangeException(nameof(value), value, null);
            }
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof (MovementDirection);
        }
    }
}
