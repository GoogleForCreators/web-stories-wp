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
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { FlagsProvider } from 'flagged';

/**
 * Internal dependencies
 */
import theme from '../theme';
import { ConfigProvider } from '../app/config';
import MockApiProvider from './mockApiProvider';

// eslint-disable-next-line react/prop-types
const WithThemeProvider = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

const renderWithTheme = (ui, options) =>
  render(ui, { wrapper: WithThemeProvider, ...options });

export default renderWithTheme;

const defaultProviderValues = {
  features: {},
  theme,
  config: {},
  api: {},
};

// Please use renderWithProviders instead of renderWithTheme or renderWithProviders
// and feel free to add provider/mock provider as needed to this util.
// TODO: deprecate and replace instances of the above render utils
export const renderWithProviders = (
  ui,
  providerValues = {},
  renderOptions = {}
) => {
  const mergedProviderValues = { ...defaultProviderValues, ...providerValues };
  return render(
    <FlagsProvider features={mergedProviderValues.features}>
      <ThemeProvider theme={mergedProviderValues.theme}>
        <ConfigProvider config={mergedProviderValues.config}>
          <MockApiProvider value={mergedProviderValues.api}>
            {ui}
          </MockApiProvider>
        </ConfigProvider>
      </ThemeProvider>
    </FlagsProvider>,
    renderOptions
  );
};
