using System;
using System.Reflection;
using Cygni.Snake.Client.Tiles;
using Newtonsoft.Json.Serialization;

namespace Cygni.Snake.Client.Communication.Serialization
{
    public class ContractResolver : CamelCasePropertyNamesContractResolver
    {
        protected override JsonContract CreateContract(Type objectType)
        {
            var contract = base.CreateContract(objectType);

            if (typeof(ITileContent).IsAssignableFrom(objectType))
                contract.Converter = new TileContentConverter();
            
            if(typeof(MovementDirection).IsAssignableFrom(objectType))
                contract.Converter = new MovementDirectionConverter();

            return contract;
        }
    }
}