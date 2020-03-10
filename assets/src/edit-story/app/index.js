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
import { ThemeProvider, StyleSheetManager } from 'styled-components';
import stylisRTLPlugin from 'stylis-plugin-rtl';
import PropTypes from 'prop-types';
import KeyboardOnlyOutlines from '@moxy/react-keyboard-only-outlines';

/**
 * Internal dependencies
 */
import theme, { GlobalStyle } from '../theme';
import { GlobalStyle as CropMoveableGlobalStyle } from '../components/movable/cropStyle';
import { GlobalStyle as DefaultMoveableGlobalStyle } from '../components/movable/moveStyle';
import { GlobalStyle as ModalGlobalStyle } from '../components/modal';
import { useDropTargets, DropTargetsProvider } from '../components/dropTargets';
import { useTransform, TransformProvider } from '../components/transform';
import { useHistory, HistoryProvider } from './history';
import { useAPI, APIProvider } from './api';
import { useConfig, ConfigProvider } from './config';
import { useFont, FontProvider } from './font';
import { useMedia, MediaProvider } from './media';
import { useStory, StoryProvider } from './story';
import Layout from './layout';

function App({ config }) {
  const { storyId, isRTL } = config;
  return (
    <StyleSheetManager stylisPlugins={isRTL ? [stylisRTLPlugin] : []}>
      <ThemeProvider theme={theme}>
        <ConfigProvider config={config}>
          <APIProvider>
            <HistoryProvider size={50}>
              <StoryProvider storyId={storyId}>
                <FontProvider>
                  <MediaProvider>
                    <TransformProvider>
                      <DropTargetsProvider>
                        <GlobalStyle />
                        <DefaultMoveableGlobalStyle />
                        <CropMoveableGlobalStyle />
                        <ModalGlobalStyle />
                        <KeyboardOnlyOutlines>
                          <Layout />
                        </KeyboardOnlyOutlines>
                      </DropTargetsProvider>
                    </TransformProvider>
                  </MediaProvider>
                </FontProvider>
              </StoryProvider>
            </HistoryProvider>
          </APIProvider>
        </ConfigProvider>
      </ThemeProvider>
    </StyleSheetManager>
  );
}

App.propTypes = {
  config: PropTypes.object.isRequired,
};

export default App;

export {
  useHistory,
  useAPI,
  useDropTargets,
  useTransform,
  useStory,
  useConfig,
  useFont,
  useMedia,
};
