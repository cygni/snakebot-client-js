using System;
using CygniSnakeBot.Client.Tiles;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace CygniSnakeBot.Client.Communication.Serialization
{
    public class TileContentConverter : Newtonsoft.Json.JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(ITileContent);
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            var jObject = JObject.Load(reader);
            var contentType = jObject["content"].Value<string>();

            switch (contentType)
            {
                case EmptyTile.CONTENT:
                    return new EmptyTile();

                case FoodTile.CONTENT:
                    return new FoodTile();

                case ObstacleTile.CONTENT:
                    return new ObstacleTile();

                case SnakeHeadTile.CONTENT:
                    return new SnakeHeadTile(jObject.GetValue("playerId", StringComparison.CurrentCultureIgnoreCase).Value<string>(),
                                             jObject.GetValue("name", StringComparison.CurrentCultureIgnoreCase).Value<string>());
                case SnakeBodyTile.CONTENT:
                    return new SnakeBodyTile(jObject.GetValue("playerId", StringComparison.CurrentCultureIgnoreCase).Value<string>(),
                                             jObject.GetValue("order", StringComparison.CurrentCultureIgnoreCase).Value<int>(), 
                                             jObject.GetValue("tail", StringComparison.CurrentCultureIgnoreCase).Value<bool>());

                default:
                    throw new ArgumentOutOfRangeException("Unable to find type of ITileContent" + jObject);
            }
        }
    }
}