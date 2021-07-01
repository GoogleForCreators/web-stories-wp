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
import { useDirection } from 'storybook-rtl-addon';
import {
  theme as designSystemTheme,
  lightMode,
  ThemeGlobals,
  ModalGlobalStyle,
} from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import theme, { GlobalStyle } from '../assets/src/edit-story/theme';
import { GlobalStyle as CropMoveableGlobalStyle } from '../assets/src/edit-story/components/moveable/cropStyle';

import { GlobalStyle as DashboardGlobalStyle } from '../assets/src/dashboard/theme';
import DashboardKeyboardOnlyOutline from '../assets/src/dashboard/utils/keyboardOnlyOutline';
import { ConfigProvider as DashboardConfigProvider } from '../assets/src/dashboard/app/config';
import { ConfigProvider as EditorConfigProvider } from '../assets/src/edit-story/app/config';
import ApiProvider from '../assets/src/dashboard/app/api/apiProvider';

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

addDecorator((story, context) => {
  const { id } = context;

  const direction = useDirection(context);
  const isRTL = 'rtl' === direction;

  const isDesignSystemStorybook = id.startsWith('designsystem');
  const isDashboardStorybook = id.startsWith('dashboard');

  if (isDashboardStorybook) {
    return (
      <ThemeProvider
        theme={{
          ...designSystemTheme,
          colors: lightMode,
        }}
      >
        <DashboardConfigProvider
          config={{
            api: { stories: 'stories' },
            editStoryURL: 'editStory',
            isRTL,
          }}
        >
          <ApiProvider>
            <DashboardGlobalStyle />
            <ModalGlobalStyle />
            <DashboardKeyboardOnlyOutline />
            {story()}
          </ApiProvider>
        </DashboardConfigProvider>
      </ThemeProvider>
    );
  }

  if (isDesignSystemStorybook) {
    // override darkMode colors
    const dsTheme = { ...designSystemTheme, colors: lightMode };
    return (
      <ThemeProvider theme={dsTheme}>
        <ThemeGlobals.Styles />
        <ModalGlobalStyle />
        {story()}
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <EditorConfigProvider config={{ isRTL }}>
        <GlobalStyle />
        <CropMoveableGlobalStyle />
        <ModalGlobalStyle />
        {story()}
      </EditorConfigProvider>
    </ThemeProvider>
  );
});
