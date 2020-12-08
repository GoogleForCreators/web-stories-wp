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
import { generatePulseKeyframes } from '../index';

describe('Pulse Effect', () => {
  describe('generatePulseKeyframes', () => {
    it('should return correct keyframes based on scale', () => {
      // scale > 1
      let scale = 2;
      let intensity = scale;
      let shrink = 1 - intensity;
      let expand = 1 + intensity;

      expect(generatePulseKeyframes(scale)).toStrictEqual([
        { transform: `scale(1)`, offset: 0.0 },
        { transform: `scale(${shrink})`, offset: 0.25 },
        { transform: `scale(${expand})`, offset: 0.75 },
        { transform: `scale(1)`, offset: 1.0 },
      ]);

      // scale < 1
      scale = 0.5;
      intensity = scale;
      shrink = 1 - intensity;
      expand = 1 + intensity;

      expect(generatePulseKeyframes(scale)).toStrictEqual([
        { transform: `scale(1)`, offset: 0.0 },
        { transform: `scale(${shrink})`, offset: 0.25 },
        { transform: `scale(${expand})`, offset: 0.75 },
        { transform: `scale(1)`, offset: 1.0 },
      ]);
    });
  });
});
