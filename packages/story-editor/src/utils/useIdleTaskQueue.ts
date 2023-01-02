/*
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * External dependencies
 */
import { useRef, useCallback } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { requestIdleCallback, cancelIdleCallback } from './idleCallback';

interface Task {
  taskId: string | null;
  task: number | null | (() => Promise<void>);
}

/**
 * Creates a FIFO idle task queue
 *
 * @return queueIdleTask
 */
function useIdleTaskQueue() {
  const taskQueue = useRef<Task[]>([]);
  const isTaskQueueRunning = useRef(false);
  const currentTask = useRef<Task>({ taskId: null, task: null });

  /**
   * Recursively runs idle task queue sequentially
   * until all queued tasks are run.
   *
   * @return {void}
   */
  const runTaskQueue = useCallback(() => {
    isTaskQueueRunning.current = true;

    if (!taskQueue.current.length) {
      isTaskQueueRunning.current = false;
      return;
    }

    const { taskId, task } = taskQueue.current.shift() as Task;
    const idleCallbackId = requestIdleCallback(() => {
      if (typeof task === 'function') {
        void task().then(() => {
          currentTask.current = { taskId: null, task: null };
          runTaskQueue();
        });
      }
    });
    currentTask.current = { taskId, task: idleCallbackId };
  }, []);

  /**
   * Clears queue of any tasks associated with the
   * given task id.
   *
   * @param id id of a task
   * @return {void}
   */
  const clearQueuedTask = useCallback(
    (id: string) => {
      // Remove any queued tasks associated with this task Id
      taskQueue.current = taskQueue.current.filter(
        ({ taskId }: Task) => taskId !== id
      );

      // If the current requested task hasn't fired, clear it
      // and restart the queue on the next task
      const { taskId, task }: Task = currentTask.current;
      if (id === taskId && typeof task === 'number') {
        cancelIdleCallback(task);
        currentTask.current = { taskId: null, task: null };
        runTaskQueue();
      }
    },
    [runTaskQueue]
  );

  /**
   * Takes a task tuple consisting of a uid for your requested task,
   * and the requested task, and adds that task to the idleQueue.
   * Returns a cleanup function to cancel the task.
   *
   * Idle Task Queue is a FIFO queue (first in first out)
   */
  const queueIdleTask = useCallback(
    ({ taskId, task }: Task) => {
      if (taskId) {
        // Clear queue of any stale tasks
        clearQueuedTask(taskId);
      }
      // Add request to generate page image generation queue
      taskQueue.current.push({ taskId, task });

      // If the queue has stopped processing because
      // it ran out of entries, restart it
      if (!isTaskQueueRunning.current) {
        runTaskQueue();
      }

      return () => {
        if (taskId) {
          clearQueuedTask(taskId);
        }
      };
    },
    [runTaskQueue, clearQueuedTask]
  );

  return queueIdleTask;
}

export default useIdleTaskQueue;
