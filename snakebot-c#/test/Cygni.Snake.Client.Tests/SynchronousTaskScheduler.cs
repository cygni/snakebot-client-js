using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Cygni.Snake.Client.Tests
{
    public class SynchronousTaskScheduler : TaskScheduler
    {
        public static void Run(Action action)
        {
            TaskScheduler scheduler = new SynchronousTaskScheduler();
            Task.Factory.StartNew(action, CancellationToken.None, TaskCreationOptions.None, scheduler);
        }

        protected override void QueueTask(Task task)
        {
            TryExecuteTask(task);
        }

        protected override bool TryExecuteTaskInline(Task task, bool wasPreviouslyQueued)
        {
            return TryExecuteTask(task);
        }

        protected override IEnumerable<Task> GetScheduledTasks()
        {
            yield break;
        }
    }
}