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
Object.defineProperty(stylisRTLPlugin, 'name', { value: 'stylisRTLPlugin' });
import PropTypes from 'prop-types';
import {
  SnackbarProvider,
  ModalGlobalStyle,
  deepMerge,
} from '@googleforcreators/design-system';
import { FlagsProvider } from 'flagged';
import { TransformProvider } from '@googleforcreators/transform';
import {
  DefaultMoveableGlobalStyle,
  CropMoveableGlobalStyle,
} from '@googleforcreators/moveable';

/**
 * Internal dependencies
 */
import theme, { GlobalStyle } from './theme';
import ErrorBoundary from './components/errorBoundary';
import { ConfigProvider } from './app/config';
import { APIProvider } from './app/api';
import { Media3pApiProvider } from './app/media/media3p/api';
import { HistoryProvider } from './app/history';
import { StoryProvider } from './app/story';
import { FontProvider } from './app/font';
import { MediaProvider } from './app/media';
import { CurrentUserProvider } from './app/currentUser';
import { TaxonomyProvider } from './app/taxonomy';
import AutoSaveHandler from './components/autoSaveHandler';
import { DropTargetsProvider } from './components/dropTargets';
import { HelpCenterProvider } from './app/helpCenter';
import { PageDataUrlProvider } from './app/pageDataUrls';
import DevTools from './components/devTools';
import { GlobalStyle as CalendarStyle } from './components/form/dateTime/calendarStyle';
import KeyboardOnlyOutlines from './utils/keyboardOnlyOutline';
import getDefaultConfig from './getDefaultConfig';

import './app/store';

function StoryEditor({ config, initialEdits, children }) {
  const _config = deepMerge(getDefaultConfig(), config);
  const { storyId, isRTL, flags } = _config;

  return (
    <FlagsProvider features={flags}>
      <StyleSheetManager stylisPlugins={isRTL ? [stylisRTLPlugin] : []}>
        <ThemeProvider theme={theme}>
          <ErrorBoundary>
            <ConfigProvider config={_config}>
              <APIProvider>
                <Media3pApiProvider>
                  <HistoryProvider size={50}>
                    <SnackbarProvider>
                      <StoryProvider
                        storyId={storyId}
                        initialEdits={initialEdits}
                      >
                        <TaxonomyProvider>
                          <CurrentUserProvider>
                            <FontProvider>
                              <MediaProvider>
                                <AutoSaveHandler />
                                <TransformProvider>
                                  <DropTargetsProvider>
                                    <HelpCenterProvider>
                                      <PageDataUrlProvider>
                                        <GlobalStyle />
                                        <DevTools />
                                        <DefaultMoveableGlobalStyle />
                                        <CropMoveableGlobalStyle />
                                        <ModalGlobalStyle />
                                        <CalendarStyle />
                                        <KeyboardOnlyOutlines />
                                        {children}
                                      </PageDataUrlProvider>
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
  initialEdits: PropTypes.object,
  children: PropTypes.node,
};

export default StoryEditor;
