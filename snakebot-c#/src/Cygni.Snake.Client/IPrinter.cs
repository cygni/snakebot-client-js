using System;

namespace Cygni.Snake.Client
{
    public interface IPrinter
    {
        void Print(IPrintable printable);

        void SnakeDied(string deathReason, string id, bool thisSnake);
        void Print(string text);
    }
}