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
import isPropValid from '@emotion/is-prop-valid';
import { StyleSheetManager, ThemeProvider } from 'styled-components';
import stylisRTLPlugin from 'stylis-plugin-rtl';
Object.defineProperty(stylisRTLPlugin, 'name', { value: 'stylisRTLPlugin' });

/**
 * Internal dependencies
 */
import { theme, GlobalStyle } from '../theme';
import MessageContent from './components/messageContent';
import { ConfigProvider } from './config';
import type { ContextState } from './config/context';

interface AppProps {
  config: ContextState;
}

function App({ config }: AppProps) {
  const { isRTL } = config;

  return (
    <StyleSheetManager
      stylisPlugins={isRTL ? [stylisRTLPlugin] : []}
      shouldForwardProp={isPropValid}
    >
      <ThemeProvider theme={theme}>
        <ConfigProvider config={config}>
          <GlobalStyle />
          <MessageContent />
        </ConfigProvider>
      </ThemeProvider>
    </StyleSheetManager>
  );
}

export default App;
