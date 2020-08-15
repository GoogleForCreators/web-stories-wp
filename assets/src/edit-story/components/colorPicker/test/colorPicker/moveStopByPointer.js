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
import { LINE_LENGTH } from '../../constants';
import { arrange, firePointerEvent } from './_utils';

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
      hasGradient: true,
    });

    // Get first gradient stop
    const stop = getGradientStopAt(0);

    // Click it to make sure it's selected
    fireEvent.click(stop);

    // Click at position 0
    firePointerEvent.pointerDown(stop, {
      clientX: 0,
    });

    // Move to the 20% mark
    firePointerEvent.pointerMove(stop, {
      clientX: 0.2 * LINE_LENGTH,
    });

    expect(onChange).toHaveBeenCalledWith({
      type: 'linear',
      stops: [
        { color: { r: 0, g: 255, b: 0, a: 0.4 }, position: 0.2 },
        { color: { r: 255, g: 0, b: 255, a: 0.8 }, position: 1 },
      ],
    });
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
        { color: { r: 0, g: 255, b: 0, a: 0.4 }, position: 0.4 },
        { color: { r: 255, g: 0, b: 255, a: 0.8 }, position: 1 },
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

  it('should reorder stops when dragging past an existing stop', () => {
    const { getGradientStopAt, onChange } = arrange({
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

    // Get first gradient stop
    const stop = getGradientStopAt(0);

    // Click it to make sure it's selected
    fireEvent.click(stop);

    // Click at position 0
    firePointerEvent.pointerDown(stop, {
      clientX: 0,
    });

    // Move to the 60% mark past the stop at 40%
    firePointerEvent.pointerMove(stop, {
      clientX: 0.6 * LINE_LENGTH,
    });

    expect(onChange).toHaveBeenCalledWith({
      type: 'linear',
      stops: [
        { color: { r: 0, g: 255, b: 0 }, position: 0.4 },
        { color: { r: 255, g: 0, b: 0 }, position: 0.6 },
        { color: { r: 0, g: 0, b: 255 }, position: 1 },
      ],
    });
    onChange.mockReset();
  });

  it('should delete stop when dragging vertically off the line', async () => {
    const { getGradientStopAt, getGradientStops, onChange } = arrange({
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

    // Get second gradient stop at 40%
    const stop = getGradientStopAt(40);

    // Click it to make sure it's selected
    fireEvent.click(stop);

    // Click at position 40,0
    firePointerEvent.pointerDown(stop, {
      clientX: 0.4 * LINE_LENGTH,
      clientY: 0,
    });

    // Move a little up and to the 60% mark
    firePointerEvent.pointerMove(stop, {
      clientX: 0.6 * LINE_LENGTH,
      clientY: 20,
    });

    // Expect stop to still exist and be moved
    expect(onChange).toHaveBeenCalledWith({
      type: 'linear',
      stops: [
        { color: { r: 255, g: 0, b: 0 }, position: 0 },
        { color: { r: 0, g: 255, b: 0 }, position: 0.6 },
        { color: { r: 0, g: 0, b: 255 }, position: 1 },
      ],
    });
    onChange.mockReset();

    // Move a lot up and to the 80% mark
    firePointerEvent.pointerMove(stop, {
      clientX: 0.8 * LINE_LENGTH,
      clientY: 50,
    });

    // Wait for callback to have been called after debounce
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));

    // Expect middle stop to be removed
    expect(getGradientStops()).toHaveLength(2);
    expect(onChange).toHaveBeenCalledWith({
      type: 'linear',
      stops: [
        { color: { r: 255, g: 0, b: 0 }, position: 0 },
        { color: { r: 0, g: 0, b: 255 }, position: 1 },
      ],
    });
    onChange.mockReset();
  });
});
