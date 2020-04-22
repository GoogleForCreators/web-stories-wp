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
import theme, { GlobalStyle } from '../theme';
import KeyboardOnlyOutline from '../utils/keyboardOnlyOutline';
import { APP_ROUTES } from '../constants';
import ApiProvider from './api/apiProvider';
import { Route, RouterProvider } from './router';
import { ConfigProvider } from './config';
import {
  MyStoriesView,
  TemplateDetail,
  TemplatesGalleryView,
  MyBookmarksView,
} from './views';

function App({ config }) {
  const { isRTL } = config;
  return (
    <StyleSheetManager stylisPlugins={isRTL ? [stylisRTLPlugin] : []}>
      <ThemeProvider theme={theme}>
        <ConfigProvider config={config}>
          <ApiProvider>
            <RouterProvider>
              <GlobalStyle />
              <KeyboardOnlyOutline />
              <Route
                exact
                path={APP_ROUTES.MY_STORIES}
                component={<MyStoriesView />}
              />
              <Route
                path={APP_ROUTES.TEMPLATE_DETAIL}
                component={<TemplateDetail />}
              />
              <Route
                path={APP_ROUTES.TEMPLATES_GALLERY}
                component={<TemplatesGalleryView />}
              />
              <Route
                path={APP_ROUTES.MY_BOOKMARKS}
                component={<MyBookmarksView />}
              />
            </RouterProvider>
          </ApiProvider>
        </ConfigProvider>
      </ThemeProvider>
    </StyleSheetManager>
  );
}

App.propTypes = {
  config: PropTypes.object.isRequired,
};

export default App;
