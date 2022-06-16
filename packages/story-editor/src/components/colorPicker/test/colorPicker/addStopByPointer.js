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
import { act, waitFor } from '@testing-library/react';
import { firePointerEvent } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import { LINE_LENGTH } from '../../constants';
import { arrange } from './_utils';

// There's a slight offset, so +1
const OFFSET20 = LINE_LENGTH * 0.2 + 1;

describe('<ColorPicker /> when adding a stop with a pointer device', () => {
  it('should show temp stop when hovering and add a stop when clicking', async () => {
    const { getGradientLine, getGradientStops, getTempGradientStop, onChange } =
      arrange({
        color: {
          type: 'linear',
          stops: [
            { color: { r: 0, g: 255, b: 0, a: 0.4 }, position: 0 },
            { color: { r: 255, g: 0, b: 255, a: 0.8 }, position: 1 },
          ],
        },
        allowsGradient: true,
      });

    // Initially 2 stops should be visible
    await waitFor(() => expect(getGradientStops()).toHaveLength(2));

    // No temp stop visible initially
    await waitFor(() => expect(getTempGradientStop()).not.toBeInTheDocument());

    // Hover gradient line at 20% mark
    act(() => {
      firePointerEvent.pointerMove(getGradientLine(), {
        clientX: OFFSET20,
      });
    });

    // Expect a temp stop be added at 20%
    await waitFor(() => expect(getTempGradientStop()).toBeInTheDocument());
    await waitFor(() =>
      expect(getTempGradientStop()).toHaveAttribute(
        'aria-label',
        // Due to rounding, the stop might be reported as being at 21%
        expect.stringMatching(/temporary gradient stop at 2[01]%/i)
      )
    );

    // Click gradient line at 20% mark
    act(() => {
      firePointerEvent.pointerDown(getGradientLine(), {
        clientX: OFFSET20,
      });
    });

    // Temp stop should be removed now
    await waitFor(() => expect(getTempGradientStop()).not.toBeInTheDocument());

    // 3 stops should be visible
    await waitFor(() => expect(getGradientStops()).toHaveLength(3));

    // And gradient should now have an extra stop
    // Note that actual color is not tested here - see tests of insertStop and useColor for that
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({
        type: 'linear',
        stops: [
          { color: { r: 0, g: 255, b: 0, a: 0.4 }, position: 0 },
          {
            color: {
              r: expect.any(Number),
              g: expect.any(Number),
              b: expect.any(Number),
              a: expect.any(Number),
            },
            position: expect.closeTo(0.8, 1),
          },
          { color: { r: 255, g: 0, b: 255, a: 0.8 }, position: 1 },
        ],
      });
    });
  });

  it('should remove temp stop when pointer leaves the gradient line', async () => {
    const { getGradientLine, getTempGradientStop } = arrange({
      color: {
        type: 'linear',
        stops: [
          { color: { r: 0, g: 255, b: 0, a: 0.4 }, position: 0 },
          { color: { r: 255, g: 0, b: 255, a: 0.8 }, position: 1 },
        ],
      },
      allowsGradient: true,
    });

    // No temp stop visible initially
    await waitFor(() => expect(getTempGradientStop()).not.toBeInTheDocument());

    // Hover gradient line at 20% mark
    firePointerEvent.pointerMove(getGradientLine(), {
      clientX: OFFSET20,
    });

    // Expect temp stop to be visible
    expect(getTempGradientStop()).toBeInTheDocument();

    // Move pointer out
    firePointerEvent.pointerLeave(getGradientLine());

    // Temp stop should be removed now
    expect(getTempGradientStop()).not.toBeInTheDocument();
  });

  it('should not add temp stop when hovering existing stop', async () => {
    const { getGradientStopAt, getTempGradientStop } = arrange({
      color: {
        type: 'linear',
        stops: [
          { color: { r: 0, g: 255, b: 0, a: 0.4 }, position: 0 },
          { color: { r: 255, g: 0, b: 255, a: 0.8 }, position: 1 },
        ],
      },
      allowsGradient: true,
    });

    // No temp stop visible initially
    await waitFor(() => expect(getTempGradientStop()).not.toBeInTheDocument());

    // Hover first stop (and give a fake offset)
    firePointerEvent.pointerMove(getGradientStopAt(0), {
      clientX: OFFSET20,
    });

    // Temp stop should still not be in the document
    expect(getTempGradientStop()).not.toBeInTheDocument();
  });

  it('should not add a new stop when clicking existing stop', async () => {
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

    // Click first stop (and give a fake offset)
    firePointerEvent.pointerDown(getGradientStopAt(0), {
      clientX: OFFSET20,
    });

    await waitFor(() => expect(onChange).not.toHaveBeenCalled());
  });

  it('should not remove temp stop when pointer leaves existing gradient stop', async () => {
    const { getGradientLine, getTempGradientStop, getGradientStopAt } = arrange(
      {
        color: {
          type: 'linear',
          stops: [
            { color: { r: 0, g: 255, b: 0, a: 0.4 }, position: 0 },
            { color: { r: 255, g: 0, b: 255, a: 0.8 }, position: 1 },
          ],
        },
        allowsGradient: true,
      }
    );

    // No temp stop visible initially
    await waitFor(() => expect(getTempGradientStop()).not.toBeInTheDocument());

    // Hover gradient line at 20% mark
    firePointerEvent.pointerMove(getGradientLine(), {
      clientX: OFFSET20,
    });

    // Expect temp stop to be visible
    expect(getTempGradientStop()).toBeInTheDocument();

    // Move pointer out from stop at 0%
    firePointerEvent.pointerLeave(getGradientStopAt(0));

    // Temp stop should still be in the document
    expect(getTempGradientStop()).toBeInTheDocument();
  });
});
