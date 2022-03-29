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
import { createSolid } from '@googleforcreators/patterns';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import { ConfigProvider } from '../../../../app/config';
import getDefaultConfig from '../../../../getDefaultConfig';
import { MULTIPLE_VALUE } from '../../../../constants';
import Color from '../color';
import applyOpacityChange from '../applyOpacityChange';

jest.mock('../applyOpacityChange', () => jest.fn());

function arrange(props = {}) {
  const onChange = jest.fn();
  renderWithTheme(
    <ConfigProvider config={getDefaultConfig()}>
      <Color label="Color" onChange={onChange} {...props} />
    </ConfigProvider>
  );
  const colorPreview = screen.getByRole('button', { name: 'Color' });
  const colorSection = screen.getByRole('region', {
    name: 'Color input: Color',
  });
  const opacityInput = screen.queryByLabelText(/Opacity/);
  return {
    colorPreview,
    colorSection,
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

  it("should pass 300 as width prop to the color's section when width is specified and current value is not mixed", () => {
    const { colorSection } = arrange({
      value: createSolid(255, 0, 0),
      width: 300,
    });
    expect(colorSection.getAttribute('width')).toBe('300');
  });

  it("should pass false as width prop to the color's section when width is specified and current value is mixed", () => {
    const { colorSection } = arrange({
      value: MULTIPLE_VALUE,
      width: 300,
    });
    expect(colorSection.getAttribute('width')).toBe(null);
  });

  it("should pass null as width prop to the color's section when width is not specified and current value is mixed", () => {
    const { colorSection } = arrange({
      value: MULTIPLE_VALUE,
    });
    expect(colorSection.getAttribute('width')).toBe(null);
  });

  it("should pass null as width prop to the color's section when width is not specified and current value is not mixed", () => {
    const { colorSection } = arrange({
      value: createSolid(255, 0, 0),
    });
    expect(colorSection.getAttribute('width')).toBe(null);
  });
});
