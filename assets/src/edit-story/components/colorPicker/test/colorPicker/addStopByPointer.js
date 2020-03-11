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
import { arrange, firePointerEvent } from './_utils';

const OFFSET20 = 37;

describe('<ColorPicker /> when adding a stop with a pointer device', () => {
  it('should show temp stop when hovering and add a stop when clicking', () => {
    const {
      getGradientLine,
      getGradientStops,
      getTempGradientStop,
      onChange,
    } = arrange({
      color: {
        type: 'linear',
        stops: [
          { color: { r: 0, g: 255, b: 0, a: 0.4 }, position: 0 },
          { color: { r: 255, g: 0, b: 255, a: 0.8 }, position: 1 },
        ],
      },
      hasGradient: true,
    });

    // Initially 2 stops should be visible
    expect(getGradientStops()).toHaveLength(2);

    // No temp stop visible initially
    expect(getTempGradientStop()).not.toBeInTheDocument();

    // Hover gradient line at 20% mark
    firePointerEvent.pointerMove(getGradientLine(), {
      clientX: OFFSET20,
    });

    // Expect a temp stop be added at 20%
    expect(getTempGradientStop()).toBeInTheDocument();
    expect(getTempGradientStop()).toHaveAttribute(
      'aria-label',
      expect.stringMatching(/temporary gradient stop at 20%/i)
    );

    // Click gradient line at 20% mark
    firePointerEvent.pointerDown(getGradientLine(), {
      clientX: OFFSET20,
    });

    // Temp stop should be removed now
    expect(getTempGradientStop()).not.toBeInTheDocument();

    // 3 stops should be visible
    expect(getGradientStops()).toHaveLength(3);

    // And gradient should now have an extra stop
    // Note that actual color is not tested here - see tests of insertStop and useColor for that
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
          position: 0.2,
        },
        { color: { r: 255, g: 0, b: 255, a: 0.8 }, position: 1 },
      ],
    });
  });

  it('should remove temp stop when pointer leaves the gradient line', () => {
    const { getGradientLine, getTempGradientStop } = arrange({
      color: {
        type: 'linear',
        stops: [
          { color: { r: 0, g: 255, b: 0, a: 0.4 }, position: 0 },
          { color: { r: 255, g: 0, b: 255, a: 0.8 }, position: 1 },
        ],
      },
      hasGradient: true,
    });

    // No temp stop visible initially
    expect(getTempGradientStop()).not.toBeInTheDocument();

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

  it('should not add temp stop when hovering existing stop', () => {
    const { getGradientStopAt, getTempGradientStop } = arrange({
      color: {
        type: 'linear',
        stops: [
          { color: { r: 0, g: 255, b: 0, a: 0.4 }, position: 0 },
          { color: { r: 255, g: 0, b: 255, a: 0.8 }, position: 1 },
        ],
      },
      hasGradient: true,
    });

    // No temp stop visible initially
    expect(getTempGradientStop()).not.toBeInTheDocument();

    // Hover first stop (and give a fake offset)
    firePointerEvent.pointerMove(getGradientStopAt(0), {
      clientX: OFFSET20,
    });

    // Temp stop should still not be in the document
    expect(getTempGradientStop()).not.toBeInTheDocument();
  });

  it('should not add a new stop when clicking existing stop', () => {
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

    // Click first stop (and give a fake offset)
    firePointerEvent.pointerDown(getGradientStopAt(0), {
      clientX: OFFSET20,
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('should not remove temp stop when pointer leaves existing gradient stop', () => {
    const { getGradientLine, getTempGradientStop, getGradientStopAt } = arrange(
      {
        color: {
          type: 'linear',
          stops: [
            { color: { r: 0, g: 255, b: 0, a: 0.4 }, position: 0 },
            { color: { r: 255, g: 0, b: 255, a: 0.8 }, position: 1 },
          ],
        },
        hasGradient: true,
      }
    );

    // No temp stop visible initially
    expect(getTempGradientStop()).not.toBeInTheDocument();

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
