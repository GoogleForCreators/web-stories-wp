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
import type { AnimationPart } from '../../parts';
import type { ElementId, Keyframes } from '../../types';
import generateKeyframesMap from '../generateKeyframesMap';

type AnimationParts = Record<string, AnimationPart[]>;

const mockGetAnimationParts = (src: AnimationParts) => (target: ElementId) =>
  src[target];

const mockCreateAnimationPart = (
  id: string,
  keyframes: Keyframes
): AnimationPart => ({
  id,
  keyframes,
  WAAPIAnimation: { keyframes, timings: {} },
  AMPAnimation: () => null,
  AMPTarget: () => null,
  generatedKeyframes: { [id]: keyframes },
});

describe('generateKeyframesMap', () => {
  it('should flatten keyframes into a single map', () => {
    const targets = ['target1', 'target2', 'target3'];
    const parts: AnimationParts = {
      [targets[0]]: [
        mockCreateAnimationPart('a', { transform: [1, 3, 4] }),
        mockCreateAnimationPart('b', { transform: [5, 7, 9] }),
      ],
      [targets[1]]: [mockCreateAnimationPart('c', { transform: [2, 5, 8] })],
      [targets[2]]: [mockCreateAnimationPart('d', { opacity: [0, 1, 0, 1] })],
    };

    const getAnimationParts = mockGetAnimationParts(parts);

    expect(generateKeyframesMap(targets, getAnimationParts)).toStrictEqual({
      a: { transform: [1, 3, 4] },
      b: { transform: [5, 7, 9] },
      c: { transform: [2, 5, 8] },
      d: { opacity: [0, 1, 0, 1] },
    });
  });

  it('should consolidate duplicate keyframes', () => {
    const targets = ['target1', 'target2', 'target3'];
    const parts = {
      [targets[0]]: [
        mockCreateAnimationPart('a', { transform: [1, 3, 4] }),
        mockCreateAnimationPart('b', { transform: [5, 7, 9] }),
      ],
      [targets[1]]: [mockCreateAnimationPart('a', { transform: [1, 3, 4] })],
      [targets[2]]: [
        mockCreateAnimationPart('a', { transform: [1, 3, 4] }),
        mockCreateAnimationPart('c', { opacity: [0, 1, 0, 1] }),
      ],
    };

    const getAnimationParts = mockGetAnimationParts(parts);

    expect(generateKeyframesMap(targets, getAnimationParts)).toStrictEqual({
      a: { transform: [1, 3, 4] },
      b: { transform: [5, 7, 9] },
      c: { opacity: [0, 1, 0, 1] },
    });
  });
});
