/*
 * Copyright 2022 Google LLC
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
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import {
  theme as designSystemTheme,
  lightMode,
  ThemeGlobals,
  ModalGlobalStyle,
} from '@googleforcreators/design-system';
import {
  theme,
  GlobalStyle,
  EditorConfigProvider,
} from '@googleforcreators/story-editor';
import { CropMoveableGlobalStyle } from '@googleforcreators/moveable';
import {
  DashboardGlobalStyle,
  DashboardKeyboardOnlyOutline,
  ConfigProvider as DashboardConfigProvider,
  ApiProvider,
} from '@googleforcreators/dashboard';

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

export const parameters = {
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
};

export const decorators = [
  (Story, context) => {
    const { id } = context;
    // TODO(#10380): Replacement add-on for RTL feature
    const isRTL = false;

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
              apiCallbacks: {
                getUser: () => Promise.resolve({ id: 1 }),
              },
              editStoryURL: 'editStory',
              isRTL,
              styleConstants: {
                topOffset: 0,
              },
            }}
          >
            <ApiProvider>
              <DashboardGlobalStyle />
              <ModalGlobalStyle />
              <DashboardKeyboardOnlyOutline />
              {Story()}
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
          {Story()}
        </ThemeProvider>
      );
    }

    return (
      <ThemeProvider theme={theme}>
        <EditorConfigProvider config={{ isRTL }}>
          <GlobalStyle />
          <CropMoveableGlobalStyle />
          <ModalGlobalStyle />
          {Story()}
        </EditorConfigProvider>
      </ThemeProvider>
    );
  },
];

// addDecorator((story, context) => {

// });
