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

/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["testIsKeyPressed"] }] */

/**
 * External dependencies
 */
import { fireEvent, renderHook, cleanup, act } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { useGlobalIsKeyPressed, useIsKeyPressed } from '..';

const keys = {
  a: { key: 'a', which: 65 },
  b: { key: 'b', which: 66 },
};

/** @typedef {import('@testing-library/react').RenderHookResult} RenderHookResult */

/**
 * Runs tests simulating a key being held down for useIsKeyPressed
 * and useGlobalIsKeyPressed.
 *
 * @param {RenderHookResult<boolean>} result Hook result.
 * @param {Node} node Node.
 * @param {Object<{key: string, which: number}>} key Key object.
 * @param {boolean} [shouldRegister=true] Whether the key press is registered by
 * the hook.
 */
function testIsKeyPressed(result, node, { key, which }, shouldRegister = true) {
  expect(result.current).toBe(false);

  // eslint-disable-next-line testing-library/no-unnecessary-act
  act(() => {
    fireEvent.keyDown(node, { key, which });
  });

  expect(result.current).toBe(shouldRegister);

  // eslint-disable-next-line testing-library/no-unnecessary-act
  act(() => {
    fireEvent.keyUp(node, { key, which });
  });

  expect(result.current).toBe(false);
}

describe('keyboard/index.js', () => {
  afterEach(cleanup);

  describe('useIsKeyPressed', () => {
    it('should initialize and then register key up and down events', () => {
      const container = document.createElement('div');

      const { result } = renderHook(() => useIsKeyPressed(container, 'a'));
      testIsKeyPressed(result, container, keys.a);
    });

    it('should not register when other keys are pressed', () => {
      const container = document.createElement('div');
      const { result } = renderHook(() => useIsKeyPressed(container, 'a'));
      testIsKeyPressed(result, container, keys.b, false);
    });

    it('should not register key presses on other elements', () => {
      const elemWithHook = document.createElement('div');
      const elemWhereKeyPressIsFired = document.createElement('div');

      const { result } = renderHook(() => useIsKeyPressed(elemWithHook, 'a'));

      testIsKeyPressed(result, elemWhereKeyPressIsFired, keys.a, false);
    });
  });

  describe('useGlobalIsKeyPressed', () => {
    it('should initialize and then register key up and down events', () => {
      const { result } = renderHook(() => useGlobalIsKeyPressed('a'));
      testIsKeyPressed(result, document.documentElement, keys.a);
    });

    it('should not register when other keys are pressed', () => {
      const { result } = renderHook(() => useGlobalIsKeyPressed('a'));
      testIsKeyPressed(result, document.documentElement, keys.b, false);
    });

    it('should register key presses on any part of the document', () => {
      const elements = [
        document.createElement('div'),
        document.createElement('div'),
        document.createElement('div'),
      ];

      document.body.append(...elements);

      const { result } = renderHook(() => useGlobalIsKeyPressed('a'));

      elements.forEach((e) => testIsKeyPressed(result, e, keys.a));
    });
  });
});
