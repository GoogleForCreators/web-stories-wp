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
import { generateKeyframesMap } from '../AMPKeyframes';

const mockGetAnimationParts = (src) => (target) => src[target];
const mockAnimationPart = (keyframes) => ({ generatedKeyframes: keyframes });

describe('StoryAnimation.AMPKeyframes', () => {
  describe('generateKeyframesMap', () => {
    it('should flatten keyframes into a single map', () => {
      const targets = ['target1', 'target2', 'target3'];
      const parts = {
        [targets[0]]: [
          mockAnimationPart({ bounce: { transform: [1, 3, 4] } }),
          mockAnimationPart({ dance: { transform: [5, 7, 9] } }),
        ],
        [targets[1]]: [mockAnimationPart({ flip: { transform: [2, 5, 8] } })],
        [targets[2]]: [
          mockAnimationPart({ blinkOn: { opacity: [0, 1, 0, 1] } }),
        ],
      };

      const getAnimationParts = mockGetAnimationParts(parts);

      expect(generateKeyframesMap(targets, getAnimationParts)).toStrictEqual({
        bounce: { transform: [1, 3, 4] },
        dance: { transform: [5, 7, 9] },
        flip: { transform: [2, 5, 8] },
        blinkOn: { opacity: [0, 1, 0, 1] },
      });
    });

    it('should consolidate duplicate keyframes', () => {
      const bounceKeyframes = { bounce: { transform: [1, 3, 4] } };

      const targets = ['target1', 'target2', 'target3'];
      const parts = {
        [targets[0]]: [
          mockAnimationPart(bounceKeyframes),
          mockAnimationPart({ dance: { transform: [5, 7, 9] } }),
        ],
        [targets[1]]: [mockAnimationPart(bounceKeyframes)],
        [targets[2]]: [
          mockAnimationPart(bounceKeyframes),
          mockAnimationPart({ blinkOn: { opacity: [0, 1, 0, 1] } }),
        ],
      };

      const getAnimationParts = mockGetAnimationParts(parts);

      expect(generateKeyframesMap(targets, getAnimationParts)).toStrictEqual({
        bounce: { transform: [1, 3, 4] },
        dance: { transform: [5, 7, 9] },
        blinkOn: { opacity: [0, 1, 0, 1] },
      });
    });
  });
});
