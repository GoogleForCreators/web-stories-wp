import { fireEvent } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useGlobalIsKeyPressed, useIsKeyPressed } from '../index';

/*
 * Runs tests simulating a key being held down for useIsKeyPressed
 * and useGlobalIsKeyPressed.
 * @param {HookResult<boolean>} keyNameOrSpec
 * @param {Node} node
 * @param {string} key
 * @param {number} which
 */
function testIsKeyPressed(result, node, key, which) {
  expect(result.current).toBe(false);

  act(() => {
    fireEvent.keyDown(node, { key, which });
  });

  expect(result.current).toBe(true);

  act(() => {
    fireEvent.keyUp(node, { key, which });
  });

  expect(result.current).toBe(false);
}

describe('keyboard/index.js', () => {
  describe('useIsKeyPressed', () => {
    it('should initialise and then register key up and down events', () => {
      const { result } = renderHook(() => useIsKeyPressed(document, 'a'));
      testIsKeyPressed(result, document, 'a', 65);
    });
  });

  describe('useGlobalIsKeyPressed', () => {
    it('should initialise and then register key up and down events', () => {
      const { result } = renderHook(() => useGlobalIsKeyPressed('b'));
      testIsKeyPressed(result, document, 'b', 66);
    });
  });
});
