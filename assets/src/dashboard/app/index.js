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
import { useContext } from 'react';
import { StyleSheetManager, ThemeProvider } from 'styled-components';
import stylisRTLPlugin from 'stylis-plugin-rtl';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import theme, { GlobalStyle } from '../theme';
import KeyboardOnlyOutline from '../utils/keyboardOnlyOutline';
import { APP_ROUTES, NESTED_APP_ROUTES } from '../constants';

import {
  AppFrame,
  LeftRail,
  NavProvider,
  PageContent,
  ToastProvider,
} from '../components';
import ApiProvider from './api/apiProvider';
import { Route, RouterProvider, RouterContext, matchPath } from './router';
import { ConfigProvider } from './config';
import {
  ToasterView,
  MyStoriesView,
  TemplateDetailsView,
  ExploreTemplatesView,
  SavedTemplatesView,
  StoryAnimTool,
} from './views';

const AppContent = () => {
  const {
    state: { currentPath },
  } = useContext(RouterContext);

  const hideLeftRail =
    matchPath(currentPath, NESTED_APP_ROUTES.SAVED_TEMPLATE_DETAIL) ||
    matchPath(currentPath, NESTED_APP_ROUTES.TEMPLATES_GALLERY_DETAIL);

  return (
    <AppFrame>
      {!hideLeftRail && <LeftRail />}
      <PageContent fullWidth={hideLeftRail}>
        <Route
          exact
          path={APP_ROUTES.MY_STORIES}
          component={<MyStoriesView />}
        />
        <Route
          exact
          path={APP_ROUTES.TEMPLATES_GALLERY}
          component={<ExploreTemplatesView />}
        />
        <Route
          path={NESTED_APP_ROUTES.TEMPLATES_GALLERY_DETAIL}
          component={<TemplateDetailsView />}
        />
        <Route
          exact
          path={APP_ROUTES.SAVED_TEMPLATES}
          component={<SavedTemplatesView />}
        />
        <Route
          path={NESTED_APP_ROUTES.SAVED_TEMPLATE_DETAIL}
          component={<TemplateDetailsView />}
        />
        <Route
          path={APP_ROUTES.STORY_ANIM_TOOL}
          component={<StoryAnimTool />}
        />
      </PageContent>
      <ToastProvider>
        <ToasterView />
      </ToastProvider>
    </AppFrame>
  );
};

function App({ config }) {
  const { isRTL } = config;
  return (
    <StyleSheetManager stylisPlugins={isRTL ? [stylisRTLPlugin] : []}>
      <ThemeProvider theme={theme}>
        <ConfigProvider config={config}>
          <ApiProvider>
            <NavProvider>
              <RouterProvider>
                <GlobalStyle />
                <KeyboardOnlyOutline />
                <AppContent />
              </RouterProvider>
            </NavProvider>
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
