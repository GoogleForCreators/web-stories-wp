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
import { createGlobalStyle, ThemeContext } from 'styled-components';
import { useContext } from 'react';

export const GlobalStyle = createGlobalStyle`
  #web-stories-plugin-activation-notice {
    padding: 0;
    border: none;
  }
`;

export function useTheme() {
  return useContext(ThemeContext);
}

const baseTheme = {
  fonts: {
    body: {
      family: 'Roboto',
      size: '16px',
      lineHeight: '24px',
    },
    title: {
      family: 'Roboto',
      size: '32px',
      lineHeight: '40px',
    },
    button: {
      family: 'Roboto',
      size: '16px',
      lineHeight: '32px',
    },
    stepNumber: {
      family: 'Roboto',
      size: '80px',
      lineHeight: '80px',
      fontWeight: 900,
    },
  },
  breakpoint: {
    tabletSmall: 'screen and (min-width: 700px)',
    tabletLarge: 'screen and (min-width: 1100px)',
    desktop: 'screen and (min-width: 1600px)',
  },
};

const lightTheme = {
  ...baseTheme,
  colors: {
    bg: '#ffffff',
    primary: 'rgba(0, 0, 0, 0.84)',
    secondary: 'rgba(0, 0, 0, 0.64)',
    tertiary: 'rgba(0, 0, 0, 0.14)',
    link: {
      fg: '#1A73E8',
      hover: {
        fg: '#1A1D1F',
      },
    },
    action: {
      bg: '#1A73E8',
      fg: '#ffffff',
      hover: {
        bg: '#1A1D1F',
      },
    },
  },
};

const darkTheme = {
  ...baseTheme,
  colors: {
    bg: 'linear-gradient(21.97deg, #010218 -28.03%, #1B0418 95.56%)',
    primary: 'rgba(255, 255, 255, 0.84)',
    secondary: 'rgba(255, 255, 255, 0.64)',
    tertiary: 'rgba(255, 255, 255, 0.38)',
    link: {
      fg: '#1A73E8',
      hover: {
        fg: '#1A1D1F',
      },
    },
    action: {
      bg: '#1A73E8',
      fg: '#ffffff',
      hover: {
        bg: '#1A1D1F',
      },
    },
  },
};

export { lightTheme, darkTheme };
