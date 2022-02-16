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
import {
  theme as externalDesignSystemTheme,
  lightMode,
  SnackbarProvider,
} from '@googleforcreators/design-system';
import { ConfigProvider } from '@googleforcreators/dashboard';

/**
 * Internal dependencies
 */
import MockEditorProvider from './mockEditorProvider';

const defaultProviderValues = {
  features: {},
  theme: {
    ...externalDesignSystemTheme,
    colors: lightMode,
  },
  config: {
    userId: 8675301,
    allowedImageMimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
  },
  api: {},
};

const DefaultWrapper = ({ children }) => children;

export const renderWithProviders = (
  ui,
  providerValues = {},
  renderOptions = {},
  wrapper = DefaultWrapper
) => {
  const mergedProviderValues = { ...defaultProviderValues, ...providerValues };

  const ProvidedWrapper = wrapper;

  const Wrapper = ({ children }) => (
    <ProvidedWrapper>
      <FlagsProvider features={mergedProviderValues.features}>
        <ThemeProvider theme={mergedProviderValues.theme}>
          <ConfigProvider config={mergedProviderValues.config}>
            <MockEditorProvider value={mergedProviderValues.api}>
              <SnackbarProvider value={mergedProviderValues.snackbar}>
                {children}
              </SnackbarProvider>
            </MockEditorProvider>
          </ConfigProvider>
        </ThemeProvider>
      </FlagsProvider>
    </ProvidedWrapper>
  );

  const mergedRenderOptions = { wrapper: Wrapper, ...renderOptions };

  return render(ui, mergedRenderOptions);
};

export default renderWithProviders;
