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
import getInitialStyleFromKeyframes from '../getInitialStyleFromKeyframes';

describe('getInitialStyleFromKeyframes', () => {
  it('should generate initial styles from keyframes array', () => {
    const keyframes = [
      { opacity: 1 },
      { opacity: 0.1, offset: 0.7 },
      { opacity: 0 },
    ];

    expect(getInitialStyleFromKeyframes(keyframes)).toStrictEqual({
      '--initial-opacity': 1,
      '--initial-transform': 'none',
    });
  });

  it('should generate initial styles from keyframes object', () => {
    const keyframes = {
      opacity: [0, 1],
      color: ['#fff', '#000'],
    };

    expect(getInitialStyleFromKeyframes(keyframes)).toStrictEqual({
      '--initial-opacity': 0,
      '--initial-transform': 'none',
    });
  });

  it('should ignore special attributes', () => {
    // easing
    const easingSample = [
      { transform: 'scale(0)', easing: 'linear' },
      { transform: 'scale(0.5)', offset: 0.7 },
      { transform: 'scale(1)' },
    ];

    expect(getInitialStyleFromKeyframes(easingSample)).toStrictEqual({
      '--initial-transform': 'scale(0)',
      '--initial-opacity': 1,
    });

    // offset
    const offsetSample = {
      opacity: [0, 0.5, 1],
      transform: ['scale(0.25)', 'scale(3)', 'scale(1)'],
      offset: [0, 0.25, 1],
    };

    expect(getInitialStyleFromKeyframes(offsetSample)).toStrictEqual({
      '--initial-opacity': 0,
      '--initial-transform': 'scale(0.25)',
    });
  });
});
