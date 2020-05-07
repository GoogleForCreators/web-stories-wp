/*
 * Copyright 2020 Google LLC
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
 * Internal dependencies
 */
import throttleToAnimationFrame from '../throttleToAnimationFrame';

const rafController = () => {
  /**
   * spys
   */
  let cancelAnimationFrameMock = null;
  let requestAnimationFrameMock = null;
  let nowMock = null;
  /**
   * local vars
   */
  let now = 0;
  let frameIndex = 0;
  let frameId = 0;
  const queue = [];

  const getFrameIndex = () => frameIndex;

  const setPerfNow = (time) => {
    nowMock = jest
      .spyOn(window.performance, 'now')
      .mockImplementation(() => time);
  };

  setPerfNow(now);
  requestAnimationFrameMock = jest
    .spyOn(window, 'requestAnimationFrame')
    .mockImplementation((cb) => {
      const currentFrameIndex = getFrameIndex();
      if (!queue[currentFrameIndex]) {
        queue[currentFrameIndex] = new Map();
      }
      frameId += 1;
      queue[currentFrameIndex]?.set(frameId, cb);
      return frameId;
    });

  cancelAnimationFrameMock = jest
    .spyOn(window, 'cancelAnimationFrame')
    .mockImplementation((id) => {
      const currentFrameIndex = getFrameIndex();
      queue[currentFrameIndex]?.delete(id);
    });

  return {
    executeRafAt: (ms) => {
      now = ms;
      setPerfNow(now);
      const lastFrame = frameIndex;
      /**
       * Set up new frame in case callbacks call rAF
       */
      frameIndex += 1;
      /**
       * Call each fn queued for the current frame and clear it after.
       */
      queue[lastFrame]?.forEach((cb) => cb(now));
      queue[lastFrame]?.clear();
    },
    cleanup: () => {
      nowMock?.mockRestore();
      requestAnimationFrameMock?.mockRestore();
      cancelAnimationFrameMock?.mockRestore();
    },
  };
};

describe('throttleToAnimationFrame', () => {
  let rafMocker = null;
  beforeEach(() => {
    rafMocker = rafController();
  });
  afterEach(() => {
    rafMocker?.cleanup();
  });

  it('calls the callback with args at the next animation frame', () => {
    const callback = jest.fn();
    const throttled = throttleToAnimationFrame(callback);

    const args = ['test', 1, 2];
    throttled(...args);
    expect(callback).toHaveBeenCalledTimes(0);

    rafMocker?.executeRafAt(400);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(...args);
  });

  it('calls the callback at most once per animation frame', () => {
    const callback = jest.fn();
    const throttled = throttleToAnimationFrame(callback);

    /**
     * Add one call to queue
     */
    throttled();
    throttled();
    throttled();
    expect(callback).toHaveBeenCalledTimes(0);

    /**
     * Call all callbacks in animation frame queue.
     */
    rafMocker?.executeRafAt(400);
    expect(callback).toHaveBeenCalledTimes(1);

    /**
     * Call anim frames a with no callbacks queued
     */
    rafMocker?.executeRafAt(500);
    rafMocker?.executeRafAt(600);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('calls the callback the most recent args', () => {
    const callback = jest.fn();
    const throttled = throttleToAnimationFrame(callback);

    const args1 = ['test', 1, 2];
    const args2 = ['something else', 3, 4];
    throttled(...args1);
    throttled(...args2);
    rafMocker?.executeRafAt(400);
    expect(callback).toHaveBeenCalledWith(...args2);
  });
});
