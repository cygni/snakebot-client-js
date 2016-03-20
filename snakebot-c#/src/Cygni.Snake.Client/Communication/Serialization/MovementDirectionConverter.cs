using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Cygni.Snake.Client.Communication.Serialization
{
    public class MovementDirectionConverter : Newtonsoft.Json.JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            JToken.FromObject(Enum.GetName(typeof (MovementDirection), value).ToUpper()).WriteTo(writer);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            return Enum.Parse(typeof (MovementDirection), reader.ReadAsString());
        }

        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof (MovementDirection);
        }
    }
}
