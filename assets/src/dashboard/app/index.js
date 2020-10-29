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
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { useEffect } from 'react';
import { StyleSheetManager, ThemeProvider } from 'styled-components';
import stylisRTLPlugin from 'stylis-plugin-rtl';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import {
  theme as externalDesignSystemTheme,
  lightMode,
} from '../../design-system';
import theme, { GlobalStyle } from '../theme';
import KeyboardOnlyOutline from '../utils/keyboardOnlyOutline';
import {
  APP_ROUTES,
  NESTED_APP_ROUTES,
  ROUTE_TITLES,
  ADMIN_TITLE,
} from '../constants';

import {
  AppFrame,
  LeftRail,
  NavProvider,
  PageContent,
  ToastProvider,
} from '../components';
import ApiProvider from './api/apiProvider';
import { Route, RouterProvider, matchPath, useRouteHistory } from './router';
import { ConfigProvider } from './config';
import {
  EditorSettingsView,
  ExploreTemplatesView,
  MyStoriesView,
  SavedTemplatesView,
  StoryAnimTool,
  TemplateDetailsView,
  ToasterView,
} from './views';

const AppContent = () => {
  const {
    state: { currentPath },
  } = useRouteHistory();

  useEffect(() => {
    const dynamicPageTitle = ROUTE_TITLES[currentPath] || ROUTE_TITLES.DEFAULT;
    window.document.title = sprintf(
      /* translators: Admin screen title. 1: Admin screen name, 2: Network or site name. */
      __('%1$s \u2039 %2$s \u2212 WordPress', 'web-stories'),
      dynamicPageTitle,
      ADMIN_TITLE
    );
  }, [currentPath]);

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
          path={APP_ROUTES.EDITOR_SETTINGS}
          component={<EditorSettingsView />}
        />
        <Route
          path={APP_ROUTES.STORY_ANIM_TOOL}
          component={<StoryAnimTool />}
        />
      </PageContent>
      <ToasterView />
    </AppFrame>
  );
};

function App({ config }) {
  const { isRTL } = config;
  // TODO strip local dashboard theme out and rely on theme from design-system
  const activeTheme = {
    internalTheme: theme,
    ...externalDesignSystemTheme,
    colors: lightMode,
  };
  return (
    <StyleSheetManager stylisPlugins={isRTL ? [stylisRTLPlugin] : []}>
      <ThemeProvider theme={activeTheme}>
        <ConfigProvider config={config}>
          <ToastProvider>
            <ApiProvider>
              <NavProvider>
                <RouterProvider>
                  <GlobalStyle />
                  <KeyboardOnlyOutline />
                  <AppContent />
                </RouterProvider>
              </NavProvider>
            </ApiProvider>
          </ToastProvider>
        </ConfigProvider>
      </ThemeProvider>
    </StyleSheetManager>
  );
}

App.propTypes = {
  config: PropTypes.object.isRequired,
};

export default App;
