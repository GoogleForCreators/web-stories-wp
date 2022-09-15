/*
 * Copyright 2022 Google LLC
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
/**
 * External dependencies
 */
import {
  DANGER_ZONE_HEIGHT,
  PAGE_HEIGHT,
  PAGE_WIDTH,
} from '@googleforcreators/units';
import { getCropParams } from '../getCropParams';

/**
 * External dependencies
 */

describe('getCropParams', () => {
  it('should update width when off canvas left', () => {
    const element = {
      x: -20,
      y: 0,
      width: 320,
      height: 240,
      resource: {
        width: 640,
        height: 480,
      },
    };
    const { newWidth } = getCropParams(element);
    expect(newWidth).toBe(300);
  });

  it('should update width when off canvas right', () => {
    const element = {
      x: 33 + (PAGE_WIDTH - 320),
      y: 0,
      width: 320,
      height: 240,
      resource: {
        width: 640,
        height: 480,
      },
    };
    const { newWidth } = getCropParams(element);
    expect(newWidth).toBe(287);
  });

  it('should update height when off canvas top', () => {
    const element = {
      x: 50,
      y: -20 - DANGER_ZONE_HEIGHT,
      width: 320,
      height: 240,
      resource: {
        width: 640,
        height: 480,
      },
    };
    const { newHeight } = getCropParams(element);
    expect(newHeight).toBe(220);
  });

  it('should update height when off canvas bottom', () => {
    const element = {
      x: 50,
      y: 18 + (PAGE_HEIGHT + DANGER_ZONE_HEIGHT - 240),
      width: 320,
      height: 240,
      resource: {
        width: 640,
        height: 480,
      },
    };
    const { newHeight } = getCropParams(element);
    expect(newHeight).toBe(222);
  });
});
