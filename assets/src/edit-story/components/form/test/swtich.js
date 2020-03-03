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

describe('BackgroundDisplayPanel', () => {
  it('should render slide switch with On and Off label', () => {
    const offLabel = 'Off';
    const onLabel = 'On';
    const onValue = 'on';

    const { getByText, getByLabelText } = render(<Switch />, {
      wrapper: ThemeProviderWrapper,
    });

    expect(getByText(onLabel)).toBeInTheDocument();
    expect(getByText(offLabel)).toBeInTheDocument();

    const radio = getByLabelText(offLabel);
    fireEvent.change(radio, { target: { value: onValue } });
    expect(radio.value).toBe(onValue);
  });

  it('should render slide switch with predefined value', () => {
    const offLabel = 'Fit to device';
    const onLabel = 'Do not fit';
    const offValue = 'off';
    const onValue = 'on';

    const { getByText, getByLabelText } = render(
      <Switch onLabel={onLabel} offLabel={offLabel} value={true} />,
      { wrapper: ThemeProviderWrapper }
    );

    expect(getByText(onLabel)).toBeInTheDocument();
    expect(getByText(offLabel)).toBeInTheDocument();

    const radio = getByLabelText(onLabel);
    fireEvent.change(radio, { target: { value: offValue } });
    expect(radio.value).toBe(offValue);

    fireEvent.change(radio, { target: { value: onValue } });
    expect(radio.value).toBe(onValue);
  });
});
