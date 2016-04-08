using Cygni.Snake.Client.Communication;

namespace Cygni.Snake.Client
{
    public interface IPrinter
    {
        void Print(IPrintable printable);
    }
}