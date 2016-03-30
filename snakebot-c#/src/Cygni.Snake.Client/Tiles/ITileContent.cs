using Cygni.Snake.Client.Communication;

namespace Cygni.Snake.Client.Tiles
{
    public interface ITileContent : IPrintable
    {
        string Content { get; }
    }
}