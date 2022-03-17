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
import { firePointerEvent } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import { LINE_LENGTH } from '../../constants';
import { arrange } from './_utils';

describe('<ColorPicker /> when moving a stop with a pointer device', () => {
  it('should move stop when dragging a stop', async () => {
    const { getGradientStopAt, onChange } = arrange({
      color: {
        type: 'linear',
        stops: [
          { color: { r: 0, g: 255, b: 0, a: 0.4 }, position: 0 },
          { color: { r: 255, g: 0, b: 255, a: 0.8 }, position: 1 },
        ],
      },
      allowsGradient: true,
    });

    // Get first gradient stop
    const stop = getGradientStopAt(100);

    // Click it to make sure it's selected
    fireEvent.click(stop);

    // Click at position 0
    firePointerEvent.pointerDown(stop, {
      clientX: 0,
    });

    // Move to the 30% mark
    firePointerEvent.pointerMove(stop, {
      clientX: 0.3 * LINE_LENGTH,
    });

    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith({
        type: 'linear',
        stops: [
          { color: { r: 0, g: 255, b: 0, a: 0.4 }, position: 0 },
          {
            color: { r: 255, g: 0, b: 255, a: 0.8 },
            position: expect.closeTo(0.7, 1),
          },
        ],
      })
    );
    onChange.mockReset();

    // Move to the 40% mark
    firePointerEvent.pointerMove(stop, {
      clientX: 0.4 * LINE_LENGTH,
    });

    // Wait for callback to have been called after debounce
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));

    expect(onChange).toHaveBeenCalledWith({
      type: 'linear',
      stops: [
        { color: { r: 0, g: 255, b: 0, a: 0.4 }, position: 0 },
        {
          color: { r: 255, g: 0, b: 255, a: 0.8 },
          position: expect.closeTo(0.6, 1),
        },
      ],
    });
    onChange.mockReset();

    // And release pointer
    firePointerEvent.pointerUp(stop);

    // Move back to the 20% mark
    firePointerEvent.pointerMove(stop, {
      clientX: 0.2 * LINE_LENGTH,
    });

    // Verify no new updated position
    // TODO: Wait for debounce, but it shouldn't be called, so debounce won't invoke anyway?
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should reorder stops when dragging past an existing stop', async () => {
    const { getGradientStopAt, onChange } = arrange({
      color: {
        type: 'linear',
        stops: [
          { color: { r: 255, g: 0, b: 0 }, position: 0 },
          { color: { r: 0, g: 255, b: 0 }, position: 0.4 },
          { color: { r: 0, g: 0, b: 255 }, position: 1 },
        ],
      },
      allowsGradient: true,
    });

    // Get first gradient stop
    const stop = getGradientStopAt(100);

    // Click it to make sure it's selected
    fireEvent.click(stop);

    // Click at position 0
    firePointerEvent.pointerDown(stop, {
      clientX: 0,
    });

    // Move to the 60% mark past the stop at 40%
    firePointerEvent.pointerMove(stop, {
      clientX: 0.4 * LINE_LENGTH,
    });

    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith({
        type: 'linear',
        stops: [
          { color: { r: 255, g: 0, b: 0 }, position: 0 },
          {
            color: { r: 0, g: 255, b: 0 },
            position: expect.closeTo(0.4, 1),
          },
          {
            color: { r: 0, g: 0, b: 255 },
            position: expect.closeTo(0.6, 1),
          },
        ],
      })
    );
    onChange.mockReset();
  });
});
