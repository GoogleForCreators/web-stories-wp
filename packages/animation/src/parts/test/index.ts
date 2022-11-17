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
import { createAnimationPart, throughput } from '..';
import { AnimationType } from '../../types';

describe('createAnimationPart', () => {
  /**
   * These aren't defined in jsdom so
   * can't mock. So instead just adding
   * them to the window and restoring
   * incase they ever get support.
   */
  beforeEach(() => {
    jest.spyOn(window, 'KeyframeEffect');
    jest.spyOn(window, 'Animation');
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * Ensures every animation type resolves
   * to a object as new animations
   * are created
   */
  it.each(Object.values(AnimationType))(
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

    Object.values(AnimationType).forEach((type) => {
      const properties = Array.from(
        Object.keys(createAnimationPart(type, {}))
      ).sort();

      // 'type' is being added to the assertion so we'll
      // know which animation part was being tested
      expect({ [type]: properties }).toStrictEqual({ [type]: throughputNames });
    });
  });
});
