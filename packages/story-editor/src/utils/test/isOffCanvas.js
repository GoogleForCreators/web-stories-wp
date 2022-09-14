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
 * External dependencies
 */
import {
  DANGER_ZONE_HEIGHT,
  PAGE_HEIGHT,
  PAGE_WIDTH,
} from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import { isOffCanvas } from '../isOffCanvas';

describe('isOffCanvas', () => {
  it('should return element as not off canvas', () => {
    const { offCanvas } = isOffCanvas({ x: 0, y: 0, width: 320, height: 240 });
    expect(offCanvas).toBe(false);
  });

  it('should return element off canvas', () => {
    const { offCanvas } = isOffCanvas({
      x: -10,
      y: 0,
      width: 320,
      height: 240,
    });
    expect(offCanvas).toBe(true);
  });

  it('should return off canvas params as 0', () => {
    const { offCanvasTop, offCanvasRight, offCanvasBottom, offCanvasLeft } =
      isOffCanvas({ x: 50, y: 50, width: 320, height: 240 });

    expect(offCanvasTop).toBe(0);
    expect(offCanvasRight).toBe(0);
    expect(offCanvasBottom).toBe(0);
    expect(offCanvasLeft).toBe(0);
  });

  it('should be off canvas top', () => {
    const { offCanvasTop } = isOffCanvas({
      x: 50,
      y: -10 - DANGER_ZONE_HEIGHT,
      width: 320,
      height: 240,
    });

    expect(offCanvasTop).toBe(10);
  });

  it('should be off canvas left', () => {
    const { offCanvasLeft } = isOffCanvas({
      x: -50,
      y: 0,
      width: 320,
      height: 240,
    });

    expect(offCanvasLeft).toBe(50);
  });

  it('should be off canvas right', () => {
    const { offCanvasRight } = isOffCanvas({
      x: 33 + (PAGE_WIDTH - 320),
      y: 0,
      width: 320,
      height: 240,
    });

    expect(offCanvasRight).toBe(33);
  });

  it('should be off canvas bottom', () => {
    const { offCanvasBottom } = isOffCanvas({
      x: 0,
      y: 18 + (PAGE_HEIGHT + DANGER_ZONE_HEIGHT - 240),
      width: 320,
      height: 240,
    });

    expect(offCanvasBottom).toBe(18);
  });
});
