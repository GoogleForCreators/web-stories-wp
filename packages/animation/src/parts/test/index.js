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
import { ANIMATION_TYPES } from '../../constants';
import { sanitizeTimings } from '../createAnimation';
import { createAnimationPart, throughput } from '..';

describe('createAnimationPart', () => {
  /**
   * These aren't defined in jsdom so
   * can't mock. So instead just adding
   * them to the window and restoring
   * incase they ever get support.
   */
  beforeEach(() => {
    // @ts-ignore
    jest.spyOn(window, 'KeyframeEffect').mockImplementation(() => ({}));
    // @ts-ignore
    jest.spyOn(window, 'Animation').mockImplementation(() => ({}));
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * Ensures every animation type resolves
   * to a object as new animations
   * are created
   */
  it.each(Object.values(ANIMATION_TYPES))(
    'type: %s returns a valid object with keyframes and timings for a WAAPIAnimation',
    (type) => {
      const args = {};
      const { WAAPIAnimation } = createAnimationPart(type, args);
      expect(typeof WAAPIAnimation).toBe('object');
      expect(WAAPIAnimation.keyframes).toBeDefined();
      expect(WAAPIAnimation.timings).toBeDefined();
    }
  );

  it('should return objects with the same signature for all parts and throughput', () => {
    // throughput should have the same signature as all parts
    const throughputNames = Array.from(Object.keys(throughput())).sort();

    Object.values(ANIMATION_TYPES).forEach((type) => {
      const properties = Array.from(
        Object.keys(createAnimationPart(type, {}))
      ).sort();

      // 'type' is being added to the assertion so we'll
      // know which animation part was being tested
      expect({ [type]: properties }).toStrictEqual({ [type]: throughputNames });
    });
  });

  it('should return 0 for values of `duration` and `delay` animation properties that are less than 0', () => {
    [-1, -0, 0].forEach((value) => {
      const { duration, delay } = sanitizeTimings({
        duration: value,
        delay: value,
      });
      expect(duration).toBe(0);
      expect(delay).toBe(0);
    });
    [1, 0, 12, 51, 500, 2000].forEach((value) => {
      const { duration, delay } = sanitizeTimings({
        duration: value,
        delay: value,
      });
      expect(duration).toBe(value);
      expect(delay).toBe(value);
    });
  });
});
