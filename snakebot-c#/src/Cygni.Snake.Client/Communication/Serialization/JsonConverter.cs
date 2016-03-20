using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Cygni.Snake.Client.Communication.Serialization
{
    public class JsonConverter : IConverter
    {
        private readonly JsonSerializerSettings _settings;
        
        public JsonConverter()
        {
            _settings = new JsonSerializerSettings
            {
                ContractResolver = new ContractResolver(),
                MissingMemberHandling = MissingMemberHandling.Ignore
            };
        }

        public string Serialize(object value)
        {
            return JsonConvert.SerializeObject(value, _settings);
        }

        public T Deserialize<T>(string value)
        {
            return JsonConvert.DeserializeObject<T>(value, _settings);
        }

        public string GetMessageType(string jsonMessage)
        {
            var jObject = JObject.Parse(jsonMessage);

            JToken value;
            return jObject.TryGetValue("type", StringComparison.OrdinalIgnoreCase, out value) ? value.ToString() : string.Empty;
        }
    }
}