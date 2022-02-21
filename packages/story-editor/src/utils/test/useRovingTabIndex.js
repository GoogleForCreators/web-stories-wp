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
 * Internal dependencies
 */
import { getFocusableElementDirection } from '../useRovingTabIndex';
import { getNextEnabledSibling } from '../useRovingTabIndex/flatNavigation';

describe('getNextEnabledSibling', () => {
  it('should get next sibling', () => {
    const wrapper = document.createElement('div');
    const button1 = document.createElement('button');
    wrapper.appendChild(button1);
    const button2 = document.createElement('button');
    wrapper.appendChild(button2);
    const button3 = document.createElement('button3');
    wrapper.appendChild(button3);

    expect(getNextEnabledSibling(button2, 'previousSibling')).toBe(button1);
    expect(getNextEnabledSibling(button2, 'nextSibling')).toBe(button3);
  });

  it('should skip disabled sibling', () => {
    const wrapper = document.createElement('div');
    const button1 = document.createElement('button');
    wrapper.appendChild(button1);
    const button2 = document.createElement('button');
    button2.disabled = 'true';
    wrapper.appendChild(button2);
    const button3 = document.createElement('button3');
    wrapper.appendChild(button3);

    expect(getNextEnabledSibling(button3, 'previousSibling')).toBe(button1);
    expect(getNextEnabledSibling(button1, 'nextSibling')).toBe(button3);
  });
});

describe('getSiblingDirection', () => {
  describe('RTL', () => {
    it.each(['ArrowRight', 'ArrowUp', 'PageUp'])(
      'given key: %s returns "previousSibling"',
      (key) => {
        const isRTL = true;
        expect(getFocusableElementDirection(isRTL, key)).toBe(
          'previousSibling'
        );
      }
    );

    it.each(['ArrowLeft', 'ArrowDown', 'PageDown'])(
      'given key: %s returns "nextSibling"',
      (key) => {
        const isRTL = true;
        expect(getFocusableElementDirection(isRTL, key)).toBe('nextSibling');
      }
    );
  });

  describe('LTR', () => {
    it.each(['ArrowLeft', 'ArrowUp', 'PageUp'])(
      'given key: %s returns "previousSibling"',
      (key) => {
        const isRTL = false;
        expect(getFocusableElementDirection(isRTL, key)).toBe(
          'previousSibling'
        );
      }
    );

    it.each(['ArrowRight', 'ArrowDown', 'PageDown'])(
      'given key: %s returns "nextSibling"',
      (key) => {
        const isRTL = false;
        expect(getFocusableElementDirection(isRTL, key)).toBe('nextSibling');
      }
    );
  });
});
