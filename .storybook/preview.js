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
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { addDecorator, addParameters } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { FlagsProvider } from 'flagged';
import 'web-animations-js/web-animations-next-lite.min.js';

/**
 * Internal dependencies
 */
import theme, { GlobalStyle } from '../assets/src/edit-story/theme';
import { GlobalStyle as CropMoveableGlobalStyle } from '../assets/src/edit-story/components/moveable/cropStyle';
import { GlobalStyle as ModalGlobalStyle } from '../assets/src/edit-story/components/modal';

import dashboardTheme, {
  GlobalStyle as DashboardGlobalStyle,
} from '../assets/src/dashboard/theme';
import { GlobalStyle as DashboardModalGlobalStyle } from '../assets/src/dashboard/components/modal';
import DashboardKeyboardOnlyOutline from '../assets/src/dashboard/utils/keyboardOnlyOutline';
import { ConfigProvider } from '../assets/src/dashboard/app/config';
import ApiProvider from '../assets/src/dashboard/app/api/apiProvider';

import {
  theme as designSystemTheme,
  lightMode,
} from '../assets/src/design-system/theme';

// @todo: Find better way to mock these.
const wp = {};
window.wp = window.wp || wp;
window.wp.media = {
  controller: {
    Library: {
      prototype: {
        defaults: {},
      },
    },
  },
};

const { ipad, ipad10p, ipad12p } = INITIAL_VIEWPORTS;

addParameters({
  a11y: {
    element: '#root',
    config: {},
    options: {},
    manual: true,
  },
  viewport: {
    viewports: {
      ipad,
      ipad10p,
      ipad12p,
    },
  },
  backgrounds: {
    default: 'Light',
    values: [
      { name: 'Light', value: '#fff', default: true },
      { name: 'Dark', value: 'rgba(0, 0, 0, 0.9)', default: true },
    ],
  },
});

addDecorator(withKnobs);

addDecorator((story, { id }) => {
  const isDesignSystemStorybook = id.startsWith('designsystem');
  const isDashboardStorybook = id.startsWith('dashboard');

  if (isDashboardStorybook) {
    return (
      <FlagsProvider features={{ enableAnimation: true }}>
        <ThemeProvider
          theme={{
            internalTheme: dashboardTheme,
            ...designSystemTheme,
            colors: lightMode,
          }}
        >
          <ConfigProvider
            config={{ api: { stories: 'stories' }, editStoryURL: 'editStory' }}
          >
            <ApiProvider>
              <DashboardGlobalStyle />
              <DashboardModalGlobalStyle />
              <DashboardKeyboardOnlyOutline />
              {story()}
            </ApiProvider>
          </ConfigProvider>
        </ThemeProvider>
      </FlagsProvider>
    );
  }

  if (isDesignSystemStorybook) {
    // override darkMode colors
    const dsTheme = { ...designSystemTheme, colors: lightMode };
    return <ThemeProvider theme={dsTheme}>{story()}</ThemeProvider>;
  }

  return (
    <FlagsProvider features={{ enableAnimation: true }}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <CropMoveableGlobalStyle />
        <ModalGlobalStyle />
        {story()}
      </ThemeProvider>
    </FlagsProvider>
  );
});
