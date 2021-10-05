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
import { prettifyShortcut } from '..';

describe('prettifyShortcut', () => {
  describe('default platform', () => {
    it('should prettify keyboard shortcuts', () => {
      expect(prettifyShortcut('shift+mod+z')).toBe('Shift+Ctrl+Z');
      expect(prettifyShortcut('alt+b')).toBe('Alt+B');
    });
  });

  describe('macOS / Apple platform', () => {
    beforeEach(() => {
      Object.defineProperty(window.navigator, 'platform', {
        value: 'MacIntel',
      });
    });

    it('should prettify keyboard shortcuts', () => {
      expect(prettifyShortcut('shift+mod+z')).toBe('⇧⌘Z');
      expect(prettifyShortcut('alt+b')).toBe('⌥B');
    });
  });
});
