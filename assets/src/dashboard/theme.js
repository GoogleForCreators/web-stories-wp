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

/**
 * Internal dependencies
 */
import { DROPDOWN_TYPES } from './constants';

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

const themeFonts = {
  primary: "'Google Sans', sans-serif",
  secondary: 'Roboto',
};

const colors = {
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
  bluePrimary600: '#1A73E8',
  blueLight: '#EAF2FF',
  // taken from edit-stories
  action: '#47A0F4',
  danger: '#FF0000',
  selection: '#44aaff',
  // todo
  placeholder: '#d9dbdd',
};

const borders = {
  gray50: `1px solid ${colors.gray50}`,
  gray100: `1px solid ${colors.gray100}`,
  transparent: '1px solid transparent',
  bluePrimary: `1px solid ${colors.bluePrimary}`,
  action: `1px solid ${colors.action}`,
};

const theme = {
  colors,
  borders,
  button: {
    borderRadius: 100,
  },
  dropdown: {
    [DROPDOWN_TYPES.PANEL]: {
      background: 'transparent',
      activeBackground: colors.gray25,
      borderRadius: 40,
      border: borders.gray50,
      arrowColor: colors.bluePrimary,
    },
    [DROPDOWN_TYPES.COLOR_PANEL]: {
      background: 'transparent',
      activeBackground: colors.gray25,
      borderRadius: 40,
      border: borders.gray50,
      arrowColor: colors.bluePrimary,
    },
    [DROPDOWN_TYPES.MENU]: {
      background: 'transparent',
      activeBackground: 'transparent',
      borderRadius: 4,
      border: 'none',
      arrowColor: colors.gray300,
    },
  },
  leftRail: {
    border: borders.gray50,
    contentPadding: 20,
    inset: 8,
    logoMargin: '75px auto 20px',
  },
  text: {
    shadow: '0px 1px 1px rgba(0, 0, 0, 1)',
  },
  chip: {
    shadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
  },
  typeahead: {
    borderRadius: 100,
  },
  formatContainer: {
    height: 44,
  },
  expandedTypeahead: {
    borderRadius: 8,
    boxShadow:
      '0px 0.181152px 2.29372px rgba(0, 0, 0, 0.031357), 0px 0.500862px 5.15978px rgba(0, 0, 0, 0.045),0px 1.20588px 8.99337px rgba(0, 0, 0, 0.058643), 0px 4px 17px rgba(0, 0, 0, 0.09)',
  },
  floatingTab: {
    shadow: '0px 2px 8px rgba(0, 0, 0, 0.17)',
  },
  navBar: {
    height: 64,
  },
  subNavigationBar: {
    border: borders.gray50,
  },
  table: {
    headerCellPadding: 15,
    cellPadding: 15,
    headerContentSize: 16,
    border: borders.gray50,
  },
  cardItem: {
    previewOverlay:
      'linear-gradient(360deg, rgba(26, 29, 31, 0.8) 11.58%, rgba(26, 29, 31, 0) 124.43%)',
  },
  popoverPanel: {
    desktopWidth: 595,
    tabletWidth: 395,
  },
  fonts: {
    heading1: {
      family: themeFonts.primary,
      size: 26,
      minSize: 18,
      lineHeight: 53,
      minLineHeight: 43,
      letterSpacing: -0.005,
      minLetterSpacing: -0.01,
    },
    heading3: {
      family: themeFonts.primary,
      size: 20,
      lineHeight: 28,
      letterSpacing: -0.01,
      weight: 500,
    },
    heading4: {
      family: themeFonts.primary,
      size: 28,
      lineHeight: 35,
      weight: 500,
    },
    body1: {
      family: themeFonts.primary,
      size: 16,
      weight: 500,
      lineHeight: 22,
      letterSpacing: 0.001,
    },
    body2: {
      family: themeFonts.primary,
      size: 14,
      lineHeight: 22,
      letterSpacing: 0.015,
    },
    tab: {
      family: themeFonts.primary,
      size: 16,
      minSize: 12,
      lineHeight: 20,
      letterSpacing: 0.01,
      weight: '500',
    },
    smallLabel: {
      family: themeFonts.primary,
      size: 12,
      minSize: 10,
      letterSpacing: '0.01em',
    },
    button: {
      family: themeFonts.primary,
      size: 14,
      lineHeight: 20,
      weight: '500',
    },
    pill: {
      family: themeFonts.primary,
      weight: 400,
      size: 14,
      lineHeight: 20,
      letterSpacing: 0.01,
    },
    popoverMenu: {
      family: themeFonts.primary,
      size: 14,
      lineHeight: 20,
      weight: '400',
      letterSpacing: 0.01,
    },
    dropdown: {
      family: themeFonts.primary,
      size: 14,
      lineHeight: 20,
      weight: '400',
      letterSpacing: 0.01,
    },
    textInput: {
      family: themeFonts.primary,
      size: 13,
      border: borders.gray100,
      activeBorder: borders.bluePrimary,
      weight: '400',
      letterSpacing: 0.01,
      padding: '1px 8px',
    },
    storyGridItem: {
      family: themeFonts.primary,
      size: 14,
      lineHeight: 20,
      letterSpacing: 0.01,
    },
    table: {
      family: themeFonts.primary,
      size: 14,
      weight: 'normal',
      letterSpacing: 0.01,
    },
    typeaheadInput: {
      family: themeFonts.primary,
      size: 14,
      lineHeight: 20,
      weight: '500',
      letterSpacing: 0.01,
    },
    typeaheadOptions: {
      family: themeFonts.primary,
      size: 14,
      lineHeight: 20,
      weight: '400',
      letterSpacing: 0.01,
    },
  },
  pageGutter: {
    small: {
      desktop: 20,
      min: 10,
      largeDisplayPhone: 10,
      smallDisplayPhone: 10,
    },
    // specific to detail template
    large: {
      desktop: 80,
      tablet: 40,
    },
  },
  pageHorizontalGutter: {
    desktop: 20,
    tablet: 20,
    largeDisplayPhone: 10,
    smallDisplayPhone: 10,
    min: 10,
  },
  grid: {
    columnGap: {
      desktop: 10,
      tablet: 10,
      largeDisplayPhone: 10,
      smallDisplayPhone: 10,
      min: 10,
    },
  },
  previewWidth: {
    desktop: 221,
    tablet: 189,
    largeDisplayPhone: 162,
    smallDisplayPhone: 185,
    min: 139,
    thumbnail: 33,
  },
  breakpoint: {
    desktop: 'screen and (max-width: 1280px)',
    tablet: 'screen and (max-width: 1120px)',
    largeDisplayPhone: 'screen and (max-width: 800px)',
    smallDisplayPhone: 'screen and (max-width: 684px)',
    min: 'screen and (max-width: 440px)',
    raw: {
      desktop: 1280,
      tablet: 1120,
      largeDisplayPhone: 800,
      smallDisplayPhone: 684,
      min: 440,
    },
  },
};

export default theme;
