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
import { getSiblingDirection } from '../useRovingTabIndex';

describe('getSiblingDirection', () => {
  describe('RTL', () => {
    it.each(['ArrowRight', 'ArrowUp', 'PageUp'])(
      'given key: %s returns "previousSibling"',
      (key) => {
        const isRTL = true;
        expect(getSiblingDirection(isRTL, key)).toBe('previousSibling');
      }
    );

    it.each(['ArrowLeft', 'ArrowDown', 'PageDown'])(
      'given key: %s returns "nextSibling"',
      (key) => {
        const isRTL = true;
        expect(getSiblingDirection(isRTL, key)).toBe('nextSibling');
      }
    );
  });

  describe('LTR', () => {
    it.each(['ArrowLeft', 'ArrowUp', 'PageUp'])(
      'given key: %s returns "previousSibling"',
      (key) => {
        const isRTL = false;
        expect(getSiblingDirection(isRTL, key)).toBe('previousSibling');
      }
    );

    it.each(['ArrowRight', 'ArrowDown', 'PageDown'])(
      'given key: %s returns "nextSibling"',
      (key) => {
        const isRTL = false;
        expect(getSiblingDirection(isRTL, key)).toBe('nextSibling');
      }
    );
  });
});
