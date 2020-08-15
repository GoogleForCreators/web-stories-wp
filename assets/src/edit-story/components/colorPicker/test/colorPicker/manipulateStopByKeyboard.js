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

describe('<ColorPicker /> when manipulating stops using keyboard', () => {
  it('should delete stop when pressing delete when gradient line is focused', async () => {
    const { getGradientLine, getGradientStopAt, onChange } = arrange({
      color: {
        type: 'linear',
        stops: [
          { color: { r: 255, g: 0, b: 0 }, position: 0 },
          { color: { r: 0, g: 255, b: 0 }, position: 0.5 },
          { color: { r: 0, g: 0, b: 255 }, position: 1 },
        ],
      },
      hasGradient: true,
    });

    // Send key to gradient line itself, not a stop
    fireEvent.keyDown(getGradientLine(), { key: 'Delete', which: 46 });

    expect(onChange).toHaveBeenCalledWith({
      type: 'linear',
      stops: [
        { color: { r: 0, g: 255, b: 0 }, position: 0.5 },
        { color: { r: 0, g: 0, b: 255 }, position: 1 },
      ],
    });

    // Expect next stop to have focus now, so that any
    // future key presses will still be correctly handled
    await waitFor(() => expect(getGradientStopAt(50)).toHaveFocus());
  });

  it('should delete stop when pressing backspace when gradient stop is focused', async () => {
    const { getGradientStopAt, onChange } = arrange({
      color: {
        type: 'linear',
        stops: [
          { color: { r: 255, g: 0, b: 0 }, position: 0 },
          { color: { r: 0, g: 255, b: 0 }, position: 0.5 },
          { color: { r: 0, g: 0, b: 255 }, position: 1 },
        ],
      },
      hasGradient: true,
    });

    // Select middle stop
    fireEvent.click(getGradientStopAt(50));
    fireEvent.keyDown(getGradientStopAt(50), { key: 'Backspace', which: 8 });

    expect(onChange).toHaveBeenCalledWith({
      type: 'linear',
      stops: [
        { color: { r: 255, g: 0, b: 0 }, position: 0 },
        { color: { r: 0, g: 0, b: 255 }, position: 1 },
      ],
    });

    // Expect last stop to have focus now, so that any
    // future key presses will still be correctly handled
    await waitFor(() => expect(getGradientStopAt(100)).toHaveFocus());
  });

  it('should move stop when pressing arrow keys', async () => {
    const { getGradientStopAt, onChange } = arrange({
      color: {
        type: 'linear',
        stops: [
          { color: { r: 255, g: 0, b: 0 }, position: 0 },
          { color: { r: 0, g: 255, b: 0 }, position: 0.5 },
          { color: { r: 0, g: 0, b: 255 }, position: 1 },
        ],
      },
      hasGradient: true,
    });

    const firstStop = getGradientStopAt(0);
    fireEvent.click(firstStop);

    // Move first stop left (does nothing)
    fireEvent.keyDown(firstStop, { key: 'ArrowLeft', which: 37 });

    expect(onChange).not.toHaveBeenCalled();

    // Move first stop right 10 times
    Array(10)
      .fill(0)
      .forEach(() =>
        fireEvent.keyDown(firstStop, {
          key: 'ArrowRight',
          which: 39,
        })
      );

    // Wait for callback to have been called a second time after debounce
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(2));

    expect(onChange).toHaveBeenCalledWith({
      type: 'linear',
      stops: [
        { color: { r: 255, g: 0, b: 0 }, position: 0.1 },
        { color: { r: 0, g: 255, b: 0 }, position: 0.5 },
        { color: { r: 0, g: 0, b: 255 }, position: 1 },
      ],
    });
  });

  it('should reorder stops when moving with arrow keys past another stop', () => {
    const { getGradientStopAt, onChange } = arrange({
      color: {
        type: 'linear',
        stops: [
          { color: { r: 255, g: 0, b: 0 }, position: 0 },
          { color: { r: 0, g: 255, b: 0 }, position: 0.005 },
          { color: { r: 0, g: 0, b: 255 }, position: 1 },
        ],
      },
      hasGradient: true,
    });

    const firstStop = getGradientStopAt(0);
    fireEvent.click(firstStop);
    fireEvent.keyDown(firstStop, {
      key: 'ArrowRight',
      which: 39,
    });

    expect(onChange).toHaveBeenCalledWith({
      type: 'linear',
      stops: [
        { color: { r: 0, g: 255, b: 0 }, position: 0.005 },
        { color: { r: 255, g: 0, b: 0 }, position: 0.01 },
        { color: { r: 0, g: 0, b: 255 }, position: 1 },
      ],
    });
  });

  it('should add a stop before first stop if selected and not at 0 when pressing enter', () => {
    const { getGradientStopAt, onChange } = arrange({
      color: {
        type: 'linear',
        stops: [
          { color: { r: 255, g: 0, b: 0 }, position: 0.2 },
          { color: { r: 0, g: 0, b: 255 }, position: 1 },
        ],
      },
      hasGradient: true,
    });

    const firstStop = getGradientStopAt(20);
    fireEvent.click(firstStop);
    fireEvent.keyDown(firstStop, {
      key: 'Enter',
      which: 13,
    });

    expect(onChange).toHaveBeenCalledWith({
      type: 'linear',
      stops: [
        { color: { r: 255, g: 0, b: 0 }, position: 0 },
        { color: { r: 255, g: 0, b: 0 }, position: 0.2 },
        { color: { r: 0, g: 0, b: 255 }, position: 1 },
      ],
    });
  });

  it('should add a stop after last stop if selected and not at 100 when pressing enter', () => {
    const { getGradientStopAt, onChange } = arrange({
      color: {
        type: 'linear',
        stops: [
          { color: { r: 255, g: 0, b: 0 }, position: 0 },
          { color: { r: 0, g: 0, b: 255 }, position: 0.8 },
        ],
      },
      hasGradient: true,
    });

    const lastStop = getGradientStopAt(80);
    fireEvent.click(lastStop);
    fireEvent.keyDown(lastStop, {
      key: 'Enter',
      which: 13,
    });

    expect(onChange).toHaveBeenCalledWith({
      type: 'linear',
      stops: [
        { color: { r: 255, g: 0, b: 0 }, position: 0 },
        { color: { r: 0, g: 0, b: 255 }, position: 0.8 },
        { color: { r: 0, g: 0, b: 255 }, position: 1 },
      ],
    });
  });

  it('should add a stop half-way after the current stop if not last when pressing enter', () => {
    const { getGradientStopAt, onChange } = arrange({
      color: {
        type: 'linear',
        stops: [
          { color: { r: 255, g: 0, b: 0 }, position: 0 },
          { color: { r: 0, g: 255, b: 0 }, position: 0.2 },
          { color: { r: 0, g: 0, b: 255 }, position: 1 },
        ],
      },
      hasGradient: true,
    });

    const someStop = getGradientStopAt(20);
    fireEvent.click(someStop);
    fireEvent.keyDown(someStop, {
      key: 'Enter',
      which: 13,
    });

    expect(onChange).toHaveBeenCalledWith({
      type: 'linear',
      stops: [
        { color: { r: 255, g: 0, b: 0 }, position: 0 },
        { color: { r: 0, g: 255, b: 0 }, position: 0.2 },
        {
          color: { r: 0, g: expect.any(Number), b: expect.any(Number) },
          position: 0.6,
        },
        { color: { r: 0, g: 0, b: 255 }, position: 1 },
      ],
    });
  });

  it('should add a stop half-way before the current stop if last at 100 when pressing enter', () => {
    const { getGradientStopAt, onChange } = arrange({
      color: {
        type: 'linear',
        stops: [
          { color: { r: 255, g: 0, b: 0 }, position: 0 },
          { color: { r: 0, g: 255, b: 0 }, position: 0.2 },
          { color: { r: 0, g: 0, b: 255 }, position: 1 },
        ],
      },
      hasGradient: true,
    });

    const lastStop = getGradientStopAt(100);
    fireEvent.click(lastStop);
    fireEvent.keyDown(lastStop, {
      key: 'Enter',
      which: 13,
    });

    expect(onChange).toHaveBeenCalledWith({
      type: 'linear',
      stops: [
        { color: { r: 255, g: 0, b: 0 }, position: 0 },
        { color: { r: 0, g: 255, b: 0 }, position: 0.2 },
        {
          color: { r: 0, g: expect.any(Number), b: expect.any(Number) },
          position: 0.6,
        },
        { color: { r: 0, g: 0, b: 255 }, position: 1 },
      ],
    });
  });
});
