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
  PopupProvider,
  theme as externalDesignSystemTheme,
  ThemeGlobals,
  deepMerge,
} from '@googleforcreators/design-system';
import { StyleSheetManager, ThemeProvider } from 'styled-components';
import stylisRTLPlugin from 'stylis-plugin-rtl';
Object.defineProperty(stylisRTLPlugin, 'name', { value: 'stylisRTLPlugin' });
import PropTypes from 'prop-types';
import { FlagsProvider } from 'flagged';

/**
 * Internal dependencies
 */
import { ConfigProvider } from './app/config';
import ApiProvider from './app/api/apiProvider';
import { NavProvider } from './components';
import { RouterProvider } from './app/router';
import { GlobalStyle } from './theme';
import { KeyboardOnlyOutline } from './utils';
import getDefaultConfig from './getDefaultConfig';

function Dashboard({ config, children }) {
  const _config = deepMerge(getDefaultConfig(), config);
  const activeTheme = {
    ...externalDesignSystemTheme,
    colors: lightMode,
  };
  const {
    isRTL,
    flags,
    styleConstants: { leftOffset, topOffset } = {},
  } = _config;
  return (
    <FlagsProvider features={flags}>
      <StyleSheetManager stylisPlugins={isRTL ? [stylisRTLPlugin] : []}>
        <ThemeProvider theme={activeTheme}>
          <ThemeGlobals.Styles />
          <ModalGlobalStyle />
          <ConfigProvider config={_config}>
            <ApiProvider>
              <NavProvider>
                <RouterProvider>
                  <SnackbarProvider>
                    <PopupProvider
                      value={{
                        isRTL,
                        leftOffset,
                        topOffset,
                      }}
                    >
                      <GlobalStyle />
                      <KeyboardOnlyOutline />
                      {children}
                    </PopupProvider>
                  </SnackbarProvider>
                </RouterProvider>
              </NavProvider>
            </ApiProvider>
          </ConfigProvider>
        </ThemeProvider>
      </StyleSheetManager>
    </FlagsProvider>
  );
}

Dashboard.propTypes = {
  config: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default Dashboard;
