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
import isMouseUpAClick from '../isMouseUpAClick';

describe('isMouseUpAClick', () => {
  it('should detect a click correctly', () => {
    const evt = {
      clientX: 0,
      clientY: 0,
    };
    const coordinates = {
      x: 0,
      y: 0,
    };
    const time = window.performance.now() + 1000; // Time in the future to be sure.
    expect(isMouseUpAClick(evt, time, coordinates)).toBeTrue();
  });

  it('should not consider a very short movement a click if it takes long time', () => {
    const evt = {
      clientX: 0,
      clientY: 0,
    };
    const coordinates = {
      x: 1,
      y: 1,
    };
    const time = window.performance.now() - 301;
    expect(isMouseUpAClick(evt, time, coordinates)).toBeFalse();
  });

  it('should not consider a longer movement a click even if quick', () => {
    const evt = {
      clientX: 0,
      clientY: 0,
    };
    const coordinates = {
      x: 3,
      y: 3,
    };
    const time = window.performance.now();
    expect(isMouseUpAClick(evt, time, coordinates)).toBeFalse();
  });
});
