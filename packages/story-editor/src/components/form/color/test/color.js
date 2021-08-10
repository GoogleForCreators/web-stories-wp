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
import { fireEvent, screen } from '@testing-library/react';
import { createSolid } from '@web-stories-wp/patterns';
/**
 * Internal dependencies
 */
import Color from '../color';
import applyOpacityChange from '../applyOpacityChange';
import { renderWithTheme } from '../../../../testUtils';

jest.mock('../applyOpacityChange', () => jest.fn());

function arrange(props = {}) {
  const onChange = jest.fn();
  renderWithTheme(<Color label="Color" onChange={onChange} {...props} />);
  const colorPreview = screen.getByRole('button', { name: 'Color' });
  const opacityInput = screen.queryByLabelText(/Opacity/);
  return {
    colorPreview,
    opacityInput,
    onChange,
  };
}

describe('<Color />', () => {
  it('should render both color preview and opacity input', () => {
    const { colorPreview, opacityInput } = arrange({
      value: createSolid(255, 0, 0),
    });

    expect(colorPreview).toBeInTheDocument();
    expect(opacityInput).toBeInTheDocument();
  });

  it('should update via `applyOpacityChange` when opacity changes', () => {
    const { opacityInput, onChange } = arrange({
      value: createSolid(255, 0, 0),
    });

    applyOpacityChange.mockImplementationOnce(() =>
      createSolid(255, 0, 0, 0.3)
    );

    fireEvent.change(opacityInput, { target: { value: '30' } });
    fireEvent.blur(opacityInput);

    expect(applyOpacityChange).toHaveBeenCalledWith(
      createSolid(255, 0, 0),
      0.3
    );

    expect(onChange).toHaveBeenCalledWith(createSolid(255, 0, 0, 0.3));
  });
});
