using System;
using System.Collections.Generic;
using Cygni.Snake.Client.Communication;

namespace Cygni.Snake.Client.Tiles
{
    public abstract class SnakePartTile : Colored
    {
        protected SnakePartTile(string playerId) : base(playerId)
        {
            PlayerId = playerId;
        }

        public string PlayerId { get; }
    }
}