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
import { createShortcutAriaLabel } from '..';

describe('createShortcutArialabel', () => {
  it.each`
    operatingSystem | shortcut            | result
    ${'MacIntel'}   | ${'mod alt delete'} | ${'Command Option Delete'}
    ${'Windows'}    | ${'mod alt delete'} | ${'Control+Alt+Delete'}
    ${'MacIntel'}   | ${'Shift 1 ,'}      | ${'Shift 1 Comma'}
    ${'Windows'}    | ${'Shift 1 ,'}      | ${'Shift+1+Comma'}
    ${'MacIntel'}   | ${'j . `'}          | ${'J Period Backtick'}
    ${'Windows'}    | ${'j . `'}          | ${'J+Period+Backtick'}
    ${'MacIntel'}   | ${'1 2 3'}          | ${'1 2 3'}
    ${'Windows'}    | ${'1 2 3'}          | ${'1+2+3'}
    ${'MacIntel'}   | ${'ctrl . ,'}       | ${'Control Period Comma'}
    ${'Windows'}    | ${'ctrl . ,'}       | ${'Control+Period+Comma'}
  `(
    'should return $result for $shortcut on $operatingSystem',
    ({ operatingSystem, shortcut, result }) => {
      Object.defineProperty(window.navigator, 'platform', {
        value: operatingSystem,
        configurable: true,
      });

      expect(createShortcutAriaLabel(shortcut)).toBe(result);
    }
  );
});
