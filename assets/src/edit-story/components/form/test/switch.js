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
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ThemeProvider } from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import theme from '../../../theme';
import Switch from '../switch';

function ThemeProviderWrapper({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

ThemeProviderWrapper.propTypes = {
  children: PropTypes.any.isRequired,
};

describe('Switch', () => {
  it('should render with default state that can be updated', () => {
    const onLabel = 'On';
    const offLabel = 'Off';
    const onChange = jest.fn();

    const { getByText, getByLabelText } = render(
      <Switch onChange={onChange} />,
      {
        wrapper: ThemeProviderWrapper,
      }
    );

    const onLabelEl = getByText(onLabel);
    const onLabelRadio = getByLabelText(onLabel);
    const offLabelEl = getByText(offLabel);
    const offLabelRadio = getByLabelText(offLabel);

    expect(onLabelEl).toBeInTheDocument();
    expect(offLabelEl).toBeInTheDocument();

    expect(onLabelRadio.checked).toStrictEqual(false);
    expect(offLabelRadio.checked).toStrictEqual(true);

    fireEvent.click(onLabelEl);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('should render with passed default value', () => {
    const onLabel = 'On';
    const offLabel = 'Off';
    const onChange = jest.fn();

    const { getByText, getByLabelText } = render(
      <Switch
        onChange={onChange}
        onLabel={onLabel}
        offLabel={offLabel}
        value={true}
      />,
      { wrapper: ThemeProviderWrapper }
    );

    const onLabelEl = getByText(onLabel);
    const onLabelRadio = getByLabelText(onLabel);
    const offLabelEl = getByText(offLabel);
    const offLabelRadio = getByLabelText(offLabel);

    expect(onLabelRadio.checked).toStrictEqual(true);
    expect(offLabelRadio.checked).toStrictEqual(false);

    fireEvent.click(onLabelEl);

    expect(onChange).toHaveBeenCalledTimes(0);

    fireEvent.click(offLabelEl);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('should render as disabled', () => {
    const onLabel = 'On';
    const offLabel = 'Off';
    const onChange = jest.fn();

    const { getByText } = render(<Switch onChange={onChange} disabled />, {
      wrapper: ThemeProviderWrapper,
    });

    fireEvent.click(getByText(onLabel));
    fireEvent.click(getByText(offLabel));

    expect(onChange).toHaveBeenCalledTimes(0);
  });
});
