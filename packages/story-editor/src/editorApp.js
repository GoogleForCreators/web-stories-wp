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
import { useEffect } from 'react';
import { StyleSheetManager, ThemeProvider } from 'styled-components';
import stylisRTLPlugin from 'stylis-plugin-rtl';
import PropTypes from 'prop-types';
import { FontProvider } from '@web-stories-wp/fonts';
import {
  cropStyle as CropMoveableGlobalStyle,
  moveStyle as DefaultMoveableGlobalStyle,
} from '@web-stories-wp/moveable';
import { TransformProvider } from '@web-stories-wp/transform';
import { registerElementTypes } from '@web-stories-wp/element-library';
import { SnackbarProvider } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { StoryProvider } from './app/story';
import theme, { GlobalStyle } from './theme';
import ErrorBoundary from './components/errorBoundary';
import { ConfigProvider } from './app/config';
import { APIProvider } from './app/api';
import { Media3pApiProvider } from './app/media/media3p/api';
import { HistoryProvider } from './app/history';
import { MediaProvider } from './app/media';
import { CurrentUserProvider } from './app/currentUser';
import AutoSaveHandler from './components/autoSaveHandler';
import { DropTargetsProvider } from './components/dropTargets';
import StatusCheck from './components/statusCheck';
import Layout from './components/layout';
import DevTools from './components/devTools';
import { GlobalStyle as ModalGlobalStyle } from './components/modal';
import { GlobalStyle as CalendarStyle } from './components/form/dateTime/calendarStyle';
import KeyboardOnlyOutlines from './utils/keyboardOnlyOutline';
import { MetaBoxesProvider } from './integrations/wordpress/metaBoxes';

function App({ config }) {
  const { storyId, isRTL } = config;

  useEffect(() => {
    registerElementTypes();
  }, []);

  return (
    <StyleSheetManager stylisPlugins={isRTL ? [stylisRTLPlugin] : []}>
      <ThemeProvider theme={theme}>
        <ErrorBoundary>
          <ConfigProvider config={config}>
            <APIProvider>
              <StatusCheck />
              <Media3pApiProvider>
                <HistoryProvider size={50}>
                  <SnackbarProvider>
                    <MetaBoxesProvider>
                      <StoryProvider storyId={storyId}>
                        <FontProvider>
                          <CurrentUserProvider>
                            <MediaProvider>
                              <AutoSaveHandler />
                              <TransformProvider>
                                <DropTargetsProvider>
                                  <GlobalStyle />
                                  <DevTools />
                                  <DefaultMoveableGlobalStyle />
                                  <CropMoveableGlobalStyle />
                                  <ModalGlobalStyle />
                                  <CalendarStyle />
                                  <KeyboardOnlyOutlines />
                                  <Layout />
                                </DropTargetsProvider>
                              </TransformProvider>
                            </MediaProvider>
                          </CurrentUserProvider>
                        </FontProvider>
                      </StoryProvider>
                    </MetaBoxesProvider>
                  </SnackbarProvider>
                </HistoryProvider>
              </Media3pApiProvider>
            </APIProvider>
          </ConfigProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </StyleSheetManager>
  );
}

App.propTypes = {
  config: PropTypes.object.isRequired,
};

export default App;
