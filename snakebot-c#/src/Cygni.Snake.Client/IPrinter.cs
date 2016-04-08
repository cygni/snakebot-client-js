namespace Cygni.Snake.Client
{
    public interface IPrinter
    {
        void SnakeDied(string deathReason, string id, bool thisSnake);
        void Print(string text);
        void PrintMap(Map map);
    }
}