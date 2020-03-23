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
	*,
	*::after,
	*::before {
		box-sizing: border-box;
    }
`;

export function useTheme() {
  return useContext(ThemeContext);
}

const theme = {
  colors: {
    gray900: '#1A1D1F',
    gray800: '#2C3033',
    gray700: '#3F454A',
    gray600: '#4F575F',
    gray500: '#606B74',
    gray400: '#6D7A85',
    gray300: '#848D96',
    gray200: '#9AA1A9',
    gray100: '#B8BCBF',
    gray75: '#D9DBDD',
    gray50: '#EEEEEE',
    // gray25: '#F7F7F7', gray25 is duplicated, it looks like F6F6 wins out in the docs, keeping this here for now for reference.
    gray25: '#F6F6F6',
    white: '#fff',
    bluePrimary: '#2979FF',
    blueLight: '#EAF2FF',
    // taken from edit-stories
    action: '#47A0F4',
    danger: '#FF0000',
    selection: '#44aaff',
  },
  border: {
    buttonRadius: '100px',
  },
  text: {
    shadow: '0px 1px 1px rgba(0, 0, 0, 1)',
  },
  fonts: {
    heading1: {
      family: 'Google Sans',
      size: '38px',
      lineHeight: '53px',
      letterSpacing: '-0.005em',
    },
    body1: {
      family: 'Roboto',
      size: '16px',
      lineHeight: '24px',
      letterSpacing: '0.00625em',
    },
    body2: {
      family: 'Roboto',
      size: '14px',
      lineHeight: '16px',
      letterSpacing: '0.0142em',
    },
    tab: {
      family: 'Google Sans',
      size: '14px',
      lineHeight: '20px',
      letterSpacing: '0.01em',
      weight: '500',
    },
    label: {
      family: 'Roboto',
      size: '15px',
      lineHeight: '18px',
      weight: '400',
    },
    button: {
      family: "'Google Sans', Sans Serif",
      size: '14px',
      lineHeight: '20px',
      weight: '500',
    },
    pill: {
      family: "'Google Sans', Sans Serif",
      weight: 500,
      size: '14px',
      lineHeight: '20px',
      letterSpacing: '0.01em',
    },
    popoverMenu: {
      family: "'Google Sans', Sans Serif",
      size: '14px',
      lineHeight: '20px',
      weight: '400',
      letterSpacing: '0.01em',
    },
    dropdown: {
      family: "'Google Sans', Sans Serif",
      size: '14px',
      lineHeight: '20px',
      weight: '500',
      letterSpacing: '0.01em',
    },
  },
};

export default theme;
