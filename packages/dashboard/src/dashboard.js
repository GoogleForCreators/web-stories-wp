/*
 * Copyright 2021 Google LLC
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
import {
  lightMode,
  ModalGlobalStyle,
  SnackbarProvider,
  theme as externalDesignSystemTheme,
  ThemeGlobals,
} from '@web-stories-wp/design-system';
import { StyleSheetManager, ThemeProvider } from 'styled-components';
import stylisRTLPlugin from 'stylis-plugin-rtl';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { ConfigProvider } from './app/config';
import ApiProvider from './app/api/apiProvider';
import { NavProvider } from './components';
import { RouterProvider } from './app/router';
import { GlobalStyle } from './theme';
import { KeyboardOnlyOutline } from './utils';

function Dashboard({ config, children }) {
  const { isRTL } = config;
  const activeTheme = {
    ...externalDesignSystemTheme,
    colors: lightMode,
  };
  return (
    <StyleSheetManager stylisPlugins={isRTL ? [stylisRTLPlugin] : []}>
      <ThemeProvider theme={activeTheme}>
        <ThemeGlobals.Styles />
        <ModalGlobalStyle />
        <ConfigProvider config={config}>
          <ApiProvider>
            <NavProvider>
              <RouterProvider>
                <SnackbarProvider>
                  <GlobalStyle />
                  <KeyboardOnlyOutline />
                  {children}
                </SnackbarProvider>
              </RouterProvider>
            </NavProvider>
          </ApiProvider>
        </ConfigProvider>
      </ThemeProvider>
    </StyleSheetManager>
  );
}

Dashboard.propTypes = {
  config: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default Dashboard;
