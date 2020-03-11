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
import { fireEvent, act } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { arrange } from './_utils';

describe('<ColorPicker /> when selecting a stop', () => {
  it('should have stop focused and highlighted when selected by pointer', () => {
    const { getGradientStopAt } = arrange({
      color: {
        type: 'linear',
        stops: [
          { color: { r: 255, g: 0, b: 0 }, position: 0 },
          { color: { r: 0, g: 255, b: 0 }, position: 0.4 },
          { color: { r: 0, g: 0, b: 255 }, position: 1 },
        ],
      },
      hasGradient: true,
    });

    // Get first gradient stop at 0%
    const firstStop = getGradientStopAt(0);

    // Click it to make sure it's selected
    fireEvent.click(firstStop);

    // Assume it to be selected
    expect(firstStop).toHaveAttribute('aria-selected', 'true');

    // Get third gradient stop at 100%
    const thirdStop = getGradientStopAt(100);

    // Click it
    fireEvent.click(thirdStop);

    // Assume it to be selected
    expect(firstStop).not.toHaveAttribute('aria-selected', 'true');
    expect(thirdStop).toHaveAttribute('aria-selected', 'true');
  });

  it('should have stop highlighted when focused', () => {
    const { getGradientStopAt } = arrange({
      color: {
        type: 'linear',
        stops: [
          { color: { r: 255, g: 0, b: 0 }, position: 0 },
          { color: { r: 0, g: 255, b: 0 }, position: 0.4 },
          { color: { r: 0, g: 0, b: 255 }, position: 1 },
        ],
      },
      hasGradient: true,
    });

    // Unfortunately JSDOM does not support tab semantics, so we'll manually
    // focus elements and see that they're highlighted

    // Focus and selection to have moved to first stop
    const firstStop = getGradientStopAt(0);
    act(() => firstStop.focus());
    expect(firstStop).toHaveFocus();
    expect(firstStop).toHaveAttribute('aria-selected', 'true');

    // Now focus second stop and verify this is now highlighted
    const secondStop = getGradientStopAt(40);
    act(() => secondStop.focus());
    expect(secondStop).toHaveFocus();
    expect(firstStop).not.toHaveAttribute('aria-selected', 'true');
    expect(secondStop).toHaveAttribute('aria-selected', 'true');
  });
});
