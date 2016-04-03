using System;
using System.Reflection;
using Newtonsoft.Json.Serialization;

namespace Cygni.Snake.Client.Communication.Serialization
{
    public class ContractResolver : CamelCasePropertyNamesContractResolver
    {
        protected override JsonContract CreateContract(Type objectType)
        {
            var contract = base.CreateContract(objectType);

            if(typeof(MovementDirection).IsAssignableFrom(objectType))
                contract.Converter = new MovementDirectionConverter();

            return contract;
        }
    }
}