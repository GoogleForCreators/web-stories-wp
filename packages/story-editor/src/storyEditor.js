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
import { StyleSheetManager, ThemeProvider } from 'styled-components';
import stylisRTLPlugin from 'stylis-plugin-rtl';
import PropTypes from 'prop-types';
import {
  SnackbarProvider,
  ModalGlobalStyle,
} from '@web-stories-wp/design-system';
import { FlagsProvider } from 'flagged';

/**
 * Internal dependencies
 */
import theme, { GlobalStyle } from './theme';
import ErrorBoundary from './components/errorBoundary';
import { ConfigProvider } from './app/config';
import { APIProvider } from './app/api';
import { FileProvider } from './app/file';
import { Media3pApiProvider } from './app/media/media3p/api';
import { HistoryProvider } from './app/history';
import { StoryProvider } from './app/story';
import { FontProvider } from './app/font';
import { MediaProvider } from './app/media';
import { CurrentUserProvider } from './app/currentUser';
import { TaxonomyProvider } from './app/taxonomy';
import AutoSaveHandler from './components/autoSaveHandler';
import { TransformProvider } from './components/transform';
import { DropTargetsProvider } from './components/dropTargets';
import { HelpCenterProvider } from './app/helpCenter';
import DevTools from './components/devTools';
import { GlobalStyle as DefaultMoveableGlobalStyle } from './components/moveable/moveStyle';
import { GlobalStyle as CropMoveableGlobalStyle } from './components/moveable/cropStyle';
import { GlobalStyle as CalendarStyle } from './components/form/dateTime/calendarStyle';
import KeyboardOnlyOutlines from './utils/keyboardOnlyOutline';

function StoryEditor({ config, children }) {
  const { storyId, isRTL, flags } = config;
  return (
    <FlagsProvider features={flags}>
      <StyleSheetManager stylisPlugins={isRTL ? [stylisRTLPlugin] : []}>
        <ThemeProvider theme={theme}>
          <ErrorBoundary>
            <ConfigProvider config={config}>
              <APIProvider>
                <FileProvider>
                  <Media3pApiProvider>
                    <HistoryProvider size={50}>
                      <SnackbarProvider>
                        <StoryProvider storyId={storyId}>
                          <TaxonomyProvider>
                            <CurrentUserProvider>
                              <FontProvider>
                                <MediaProvider>
                                  <AutoSaveHandler />
                                  <TransformProvider>
                                    <DropTargetsProvider>
                                      <HelpCenterProvider>
                                        <GlobalStyle />
                                        <DevTools />
                                        <DefaultMoveableGlobalStyle />
                                        <CropMoveableGlobalStyle />
                                        <ModalGlobalStyle />
                                        <CalendarStyle />
                                        <KeyboardOnlyOutlines />
                                        {children}
                                      </HelpCenterProvider>
                                    </DropTargetsProvider>
                                  </TransformProvider>
                                </MediaProvider>
                              </FontProvider>
                            </CurrentUserProvider>
                          </TaxonomyProvider>
                        </StoryProvider>
                      </SnackbarProvider>
                    </HistoryProvider>
                  </Media3pApiProvider>
                </FileProvider>
              </APIProvider>
            </ConfigProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </StyleSheetManager>
    </FlagsProvider>
  );
}

StoryEditor.propTypes = {
  config: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default StoryEditor;
