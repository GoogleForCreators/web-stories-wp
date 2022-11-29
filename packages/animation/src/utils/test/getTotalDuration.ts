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
import { AnimationType } from '../../types';
import { getTotalDuration } from '..';

const BASE_ANIMATION = {
  id: '1',
  targets: [],
};
const type = AnimationType.BlinkOn as const;

describe('getTotalDuration', () => {
  it('returns 0 if no animations supplied', () => {
    expect(getTotalDuration()).toBe(0);
  });

  it('calculates the longest duration properly', () => {
    expect(
      getTotalDuration([
        { ...BASE_ANIMATION, type, duration: 20, delay: 10 },
        { ...BASE_ANIMATION, type, duration: 90, delay: 110 },
        { ...BASE_ANIMATION, type, duration: 50, delay: 5 },
      ])
    ).toBe(200);
  });

  it('calculates properly if missing duration or delay on animation', () => {
    expect(
      getTotalDuration([
        { ...BASE_ANIMATION, type, duration: 50, delay: 10 },
        { ...BASE_ANIMATION, type },
        { ...BASE_ANIMATION, type, duration: 40 },
      ])
    ).toBe(60);
  });
});
