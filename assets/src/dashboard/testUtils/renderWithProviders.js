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
import {
  theme as externalDesignSystemTheme,
  lightMode,
} from '../../design-system';
import theme from '../theme';
import { ConfigProvider } from '../app/config';
import { SnackbarProvider } from '../app/snackbar';
import MockApiProvider from './mockApiProvider';

const defaultProviderValues = {
  features: {},
  theme: {
    DEPRECATED_THEME: theme,
    ...externalDesignSystemTheme,
    colors: lightMode,
  },
  config: {
    capabilities: { canReadPrivatePosts: true },
    allowedImageMimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
  },
  api: {},
};

export const renderWithProviders = (
  ui,
  providerValues = {},
  renderOptions = {}
) => {
  const mergedProviderValues = { ...defaultProviderValues, ...providerValues };

  // eslint-disable-next-line react/prop-types
  const Wrapper = ({ children }) => (
    <FlagsProvider features={mergedProviderValues.features}>
      <ThemeProvider theme={mergedProviderValues.theme}>
        <ConfigProvider config={mergedProviderValues.config}>
          <MockApiProvider value={mergedProviderValues.api}>
            <SnackbarProvider value={mergedProviderValues.snackbar}>
              {children}
            </SnackbarProvider>
          </MockApiProvider>
        </ConfigProvider>
      </ThemeProvider>
    </FlagsProvider>
  );

  const mergedRenderOptions = { wrapper: Wrapper, ...renderOptions };

  return render(ui, mergedRenderOptions);
};

export default renderWithProviders;
