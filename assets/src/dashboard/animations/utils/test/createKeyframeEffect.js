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
import createKeyframeEffect from '../createKeyframeEffect';

describe('createKeyframeEffect', () => {
  describe('iteration property', () => {
    it('should swap "infinity" with Infinity', () => {
      const timings = {
        iterations: 'infinity',
      };

      const mockKeyframeEffect = jest.fn();
      global.KeyframeEffect = mockKeyframeEffect;

      createKeyframeEffect('target', 'keyframes', timings);
      expect(mockKeyframeEffect).toHaveBeenCalledWith('target', 'keyframes', {
        iterations: Infinity,
      });
    });

    it('should pass through numbers', () => {
      const timings = {
        iterations: 3,
      };

      const mockKeyframeEffect = jest.fn();
      global.KeyframeEffect = mockKeyframeEffect;

      createKeyframeEffect('target', 'keyframes', timings);
      expect(mockKeyframeEffect).toHaveBeenCalledWith(
        'target',
        'keyframes',
        timings
      );
    });

    it('should pass through other properties', () => {
      const timings = {
        duration: 1000,
        delay: 500,
        iterations: 3,
        easing: 'ease-out',
        direction: 'normal',
      };

      const mockKeyframeEffect = jest.fn();
      global.KeyframeEffect = mockKeyframeEffect;

      createKeyframeEffect('target', 'keyframes', timings);
      expect(mockKeyframeEffect).toHaveBeenCalledWith(
        'target',
        'keyframes',
        timings
      );
    });
  });
});
