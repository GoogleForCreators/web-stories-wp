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
import createSolid from '../../../../utils/createSolid';
import { arrange } from './_utils';

describe('<ColorPicker /> as it loads', () => {
  it('should render with initial focus forced to the solid pattern button', () => {
    const { getSolidButton } = arrange();

    const solidButton = getSolidButton();
    expect(solidButton).toBeInTheDocument();
    expect(solidButton).toHaveFocus();
  });

  it('should correctly set color based on given prop', () => {
    const { getEditableHexElement, rerender } = arrange({
      color: createSolid(255, 0, 0),
    });

    expect(getEditableHexElement()).toHaveTextContent(/#ff0000/i);

    rerender({ color: createSolid(0, 0, 255) });

    expect(getEditableHexElement()).toHaveTextContent(/#0000ff/i);
  });

  it('should correctly set opacity based on given prop', () => {
    const { getEditableAlphaElement, rerender } = arrange({
      color: createSolid(255, 0, 0, 0.7),
    });

    expect(getEditableAlphaElement()).toHaveTextContent(/70%/i);

    rerender({ color: createSolid(0, 0, 255) });

    expect(getEditableAlphaElement()).toHaveTextContent(/100%/i);
  });

  it('should correctly set color and opacity based on first stop for a gradient', () => {
    const { getEditableHexElement, getEditableAlphaElement } = arrange({
      color: {
        type: 'linear',
        stops: [
          { color: { r: 0, g: 255, b: 0, a: 0.4 }, position: 0 },
          { color: { r: 255, g: 0, b: 255, a: 0.8 }, position: 0 },
        ],
      },
      hasGradient: true,
    });

    expect(getEditableHexElement()).toHaveTextContent(/#00ff00/i);
    expect(getEditableAlphaElement()).toHaveTextContent(/40%/i);
  });

  it('should have gradient buttons only if enabled', () => {
    const {
      getSolidButton,
      getLinearButton,
      getRadialButton,
      rerender,
    } = arrange();

    expect(getSolidButton()).toBeInTheDocument();
    expect(getLinearButton()).not.toBeInTheDocument();
    expect(getRadialButton()).not.toBeInTheDocument();

    rerender({ hasGradient: true });

    expect(getSolidButton()).toBeInTheDocument();
    expect(getLinearButton()).toBeInTheDocument();
    expect(getRadialButton()).toBeInTheDocument();
  });

  it('should have gradient line only if pattern is non-solid', () => {
    const { getGradientLine, rerender } = arrange({
      color: createSolid(0, 0, 0),
      hasGradient: true,
    });

    expect(getGradientLine()).not.toBeInTheDocument();

    rerender({
      color: {
        stops: [
          { color: { r: 0, g: 0, b: 255 }, position: 0 },
          { color: { r: 0, g: 0, b: 255 }, position: 1 },
        ],
        type: 'linear',
      },
      hasGradient: true,
    });

    expect(getGradientLine()).toBeInTheDocument();
  });
});
