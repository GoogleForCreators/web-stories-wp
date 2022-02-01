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
 * External dependencies
 */
import {
  PAGE_HEIGHT,
  PAGE_WIDTH,
  DANGER_ZONE_HEIGHT,
} from '@googleforcreators/units';
/**
 * Internal dependencies
 */
import getOffPageOffset from '../getOffPageOffset';

describe('getOffPageOffset', () => {
  const element = {
    x: 20,
    y: 100,
    width: 75,
    height: 50,
  };

  it('returns the correct offset to place element on top of page', () => {
    const { offsetTop } = getOffPageOffset(element);
    const offset = element.y + element.height + DANGER_ZONE_HEIGHT;

    expect((offsetTop / 100.0) * element.height).toBeCloseTo(-offset);
  });

  it('returns the correct offset to place element below page', () => {
    const { offsetBottom } = getOffPageOffset(element);
    const offset = PAGE_HEIGHT - element.y + DANGER_ZONE_HEIGHT;

    expect((offsetBottom / 100) * element.height).toBeCloseTo(offset);
  });

  it('returns the correct offset to place element to the left of the page', () => {
    const { offsetLeft } = getOffPageOffset(element);
    const offset = element.x + element.width;

    expect((offsetLeft / 100.0) * element.width).toBeCloseTo(-offset);
  });

  it('returns the correct offset to place element to the right of the page', () => {
    const { offsetRight } = getOffPageOffset(element);
    const offset = PAGE_WIDTH - element.x;

    expect((offsetRight / 100.0) * element.width).toBeCloseTo(offset);
  });
});
