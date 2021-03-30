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
import { fireEvent, waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { arrange } from './_utils';

describe('<ColorPicker /> when manipulating a gradient', () => {
  it('should have stops reversed when reverse button is clicked', async () => {
    const { getGradientReverse, onChange } = arrange({
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

    fireEvent.click(getGradientReverse());

    expect(onChange).toHaveBeenCalledWith({
      type: 'linear',
      stops: [
        { color: { r: 0, g: 0, b: 255 }, position: 0 },
        { color: { r: 0, g: 255, b: 0 }, position: 0.6 },
        { color: { r: 255, g: 0, b: 0 }, position: 1 },
      ],
    });

    fireEvent.click(getGradientReverse());

    // Wait for callback to have been called a second time after debounce
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(2));

    expect(onChange).toHaveBeenCalledWith({
      type: 'linear',
      stops: [
        { color: { r: 255, g: 0, b: 0 }, position: 0 },
        { color: { r: 0, g: 255, b: 0 }, position: 0.4 },
        { color: { r: 0, g: 0, b: 255 }, position: 1 },
      ],
    });
  });

  it('should have rotation changed by .25 turn when rotate button is clicked', async () => {
    const { getGradientRotate, onChange } = arrange({
      color: {
        type: 'linear',
        rotation: 0.25,
        stops: [
          { color: { r: 255, g: 0, b: 0 }, position: 0 },
          { color: { r: 0, g: 0, b: 255 }, position: 1 },
        ],
      },
      hasGradient: true,
    });

    fireEvent.click(getGradientRotate());

    expect(onChange).toHaveBeenCalledWith({
      type: 'linear',
      rotation: 0.5,
      stops: [
        { color: { r: 255, g: 0, b: 0 }, position: 0 },
        { color: { r: 0, g: 0, b: 255 }, position: 1 },
      ],
    });

    fireEvent.click(getGradientRotate());
    fireEvent.click(getGradientRotate());

    // Wait for callback to have been called a second time after debounce
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(2));

    // Because rotation is now at 0, it's not included
    expect(onChange).toHaveBeenCalledWith({
      type: 'linear',
      stops: [
        { color: { r: 255, g: 0, b: 0 }, position: 0 },
        { color: { r: 0, g: 0, b: 255 }, position: 1 },
      ],
    });
  });
});
