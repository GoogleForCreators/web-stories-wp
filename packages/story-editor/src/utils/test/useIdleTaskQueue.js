/*
 * Copyright 2021 Google LLC
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
import { renderHook, act } from '@testing-library/react-hooks';

/**
 * Internal dependencies
 */
import useIdleTaskQueue from '../useIdleTaskQueue';
import { requestIdleCallback, cancelIdleCallback } from '../idleCallback';

jest.mock('../idleCallback', () => {
  return {
    __esModule: true,
    requestIdleCallback: jest.fn(),
    cancelIdleCallback: jest.fn(),
  };
});

describe('useIdleTaskQueue', () => {
  let mockIdleCallbacks, runIdleCallbacks;

  beforeEach(() => {
    mockIdleCallbacks = [];
    runIdleCallbacks = () => {
      while (mockIdleCallbacks.length > 0) {
        const { task } = mockIdleCallbacks.shift();
        task();
      }
    };

    requestIdleCallback.mockImplementation((callback) => {
      const idleCallbackId = Symbol();
      mockIdleCallbacks.push({ taskId: idleCallbackId, task: callback });
      return idleCallbackId;
    });
    cancelIdleCallback.mockImplementation((idleCallbackId) => {
      mockIdleCallbacks = mockIdleCallbacks.filter(
        ({ taskId }) => taskId !== idleCallbackId
      );
    });
  });

  describe('queueIdleTask', () => {
    it('calls idle tasks sequentially', async () => {
      const runAllIdleCallbacks = async () => {
        runIdleCallbacks();
        await act(async () => {
          await Promise.resolve();
        });
      };

      const {
        result: { current: queueIdleTask },
      } = renderHook(() => useIdleTaskQueue());
      const task1Tuple = { taskId: 1, task: jest.fn(() => Promise.resolve()) };
      const task2Tuple = { taskId: 2, task: jest.fn(() => Promise.resolve()) };
      const task3Tuple = { taskId: 3, task: jest.fn(() => Promise.resolve()) };

      // queue all tasks
      queueIdleTask(task1Tuple);
      queueIdleTask(task2Tuple);
      queueIdleTask(task3Tuple);

      // see that no tasks have been run
      expect(task1Tuple.task).toHaveBeenCalledTimes(0);
      expect(task2Tuple.task).toHaveBeenCalledTimes(0);
      expect(task3Tuple.task).toHaveBeenCalledTimes(0);

      // See that task queue exhibits first out (FIFO) behavior.
      await runAllIdleCallbacks();
      expect(task1Tuple.task).toHaveBeenCalledOnce();
      expect(task2Tuple.task).toHaveBeenCalledTimes(0);
      expect(task3Tuple.task).toHaveBeenCalledTimes(0);

      await runAllIdleCallbacks();
      expect(task1Tuple.task).toHaveBeenCalledOnce();
      expect(task2Tuple.task).toHaveBeenCalledOnce();
      expect(task3Tuple.task).toHaveBeenCalledTimes(0);

      await runAllIdleCallbacks();
      expect(task1Tuple.task).toHaveBeenCalledOnce();
      expect(task2Tuple.task).toHaveBeenCalledOnce();
      expect(task3Tuple.task).toHaveBeenCalledOnce();
    });
  });
});
