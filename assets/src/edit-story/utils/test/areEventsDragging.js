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
import areEventsDragging from '../areEventsDragging';

describe('areEventsDragging', () => {
  it('should *not* consider a quick sequence of events at about the same point dragging', () => {
    const firstEvent = {
      clientX: 0,
      clientY: 0,
      timeStamp: window.performance.now(),
    };
    const secondEvent = {
      clientX: 1,
      clientY: 1,
      timeStamp: window.performance.now() + 10,
    };
    expect(areEventsDragging(firstEvent, secondEvent)).toBeFalse();
  });

  it('should consider a long delay between events dragging even if only moving a small distance', () => {
    const firstEvent = {
      clientX: 0,
      clientY: 0,
      timeStamp: window.performance.now(),
    };
    const secondEvent = {
      clientX: 1,
      clientY: 1,
      timeStamp: window.performance.now() + 1000,
    };
    expect(areEventsDragging(firstEvent, secondEvent)).toBeTrue();
  });

  it('should consider a long distance between events dragging even if fired in quick succession', () => {
    const firstEvent = {
      clientX: 0,
      clientY: 0,
      timeStamp: window.performance.now(),
    };
    const secondEvent = {
      clientX: 10,
      clientY: 10,
      timeStamp: window.performance.now() + 10,
    };
    expect(areEventsDragging(firstEvent, secondEvent)).toBeTrue();
  });
});
