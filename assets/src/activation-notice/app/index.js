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
import { StyleSheetManager, ThemeProvider } from 'styled-components';
import stylisRTLPlugin from 'stylis-plugin-rtl';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { lightTheme, darkTheme, GlobalStyle } from '../theme';
import MessageContent from './components/messageContent';
import { ConfigProvider } from './config';
import usePrefersDarkMode from './utils/usePrefersDarkMode';

function App({ config }) {
  const { isRTL } = config;

  const prefersDarkMode = usePrefersDarkMode();

  return (
    <StyleSheetManager stylisPlugins={isRTL ? [stylisRTLPlugin] : []}>
      <ThemeProvider theme={prefersDarkMode ? darkTheme : lightTheme}>
        <ConfigProvider config={config}>
          <GlobalStyle />
          <MessageContent />
        </ConfigProvider>
      </ThemeProvider>
    </StyleSheetManager>
  );
}

App.propTypes = {
  config: PropTypes.object.isRequired,
};

export default App;
