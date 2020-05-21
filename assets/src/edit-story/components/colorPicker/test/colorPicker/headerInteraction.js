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
import { fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import createSolid from '../../../../utils/createSolid';
import { arrange } from './_utils';

describe('<ColorPicker /> as the header is interacted with', () => {
  it('should invoke onchange with new correct pattern when switching to linear', () => {
    const { getLinearButton, onChange } = arrange({
      color: createSolid(0, 0, 255),
      hasGradient: true,
    });

    fireEvent.click(getLinearButton());

    expect(onChange).toHaveBeenCalledWith({
      rotation: 0.5,
      stops: [
        { color: { r: 0, g: 0, b: 255 }, position: 0 },
        { color: { r: 0, g: 0, b: 255 }, position: 1 },
      ],
      type: 'linear',
    });
  });

  it('should invoke onchange with new correct pattern when switching to radial', () => {
    const { getRadialButton, onChange } = arrange({
      color: createSolid(0, 0, 255),
      hasGradient: true,
    });

    fireEvent.click(getRadialButton());

    expect(onChange).toHaveBeenCalledWith({
      stops: [
        { color: { r: 0, g: 0, b: 255 }, position: 0 },
        { color: { r: 0, g: 0, b: 255 }, position: 1 },
      ],
      type: 'radial',
    });
  });

  it('should display gradient line only if switching to non-solid pattern', () => {
    const { getGradientLine, getSolidButton, getLinearButton } = arrange({
      color: createSolid(0, 0, 0),
      hasGradient: true,
    });

    expect(getGradientLine()).not.toBeInTheDocument();
    fireEvent.click(getLinearButton());
    expect(getGradientLine()).toBeInTheDocument();
    fireEvent.click(getSolidButton());
    expect(getGradientLine()).not.toBeInTheDocument();
  });
});
