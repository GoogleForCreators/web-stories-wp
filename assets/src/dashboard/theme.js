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
  blueLight: '#EAF2FF',
  // taken from edit-stories
  action: '#47A0F4',
  danger: '#FF0000',
  selection: '#44aaff',
  // todo
  placeholder: '#d9dbdd',
};

const theme = {
  colors,
  border: {
    buttonRadius: '100px',
    typeaheadRadius: '100px',
    expandedTypeaheadRadius: '8px',
  },
  dropdown: {
    [DROPDOWN_TYPES.PANEL]: {
      background: 'transparent',
      activeBackground: colors.gray25,
      borderRadius: '40px',
      border: `1px solid ${colors.gray50}`,
      arrowColor: colors.bluePrimary,
      height: '48px',
    },
    [DROPDOWN_TYPES.MENU]: {
      background: colors.gray25,
      activeBackground: colors.gray25,
      borderRadius: '4px',
      border: 'none',
      arrowColor: colors.gray300,
      height: '40px',
    },
    [DROPDOWN_TYPES.TRANSPARENT_MENU]: {
      background: 'transparent',
      activeBackground: 'transparent',
      borderRadius: 0,
      border: 'none',
      arrowColor: colors.bluePrimary,
      height: '40px',
    },
  },
  text: {
    shadow: '0px 1px 1px rgba(0, 0, 0, 1)',
  },
  chip: {
    shadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
  },
  boxShadow: {
    expandedTypeahead:
      '0px 0.181152px 2.29372px rgba(0, 0, 0, 0.031357), 0px 0.500862px 5.15978px rgba(0, 0, 0, 0.045),0px 1.20588px 8.99337px rgba(0, 0, 0, 0.058643), 0px 4px 17px rgba(0, 0, 0, 0.09)',
  },
  floatingTab: {
    shadow: '0px 2px 8px rgba(0, 0, 0, 0.17)',
  },
  subNavigationBar: {
    border: `1px solid ${colors.gray50}`,
  },
  fonts: {
    heading1: {
      family: 'Google Sans',
      size: '38px',
      minSize: '28px',
      lineHeight: '53px',
      minLineHeight: '43px',
      letterSpacing: '-0.005em',
      minLetterSpacing: '-0.01em',
    },
    heading3: {
      family: 'Google Sans',
      size: '20px',
      lineHeight: '28px',
      letterSpacing: '-.01em',
      weight: 500,
    },
    body1: {
      family: "'Google Sans', sans-serif",
      size: '16px',
      weight: 500,
      lineHeight: '22px',
      letterSpacing: '0.001em',
    },
    body2: {
      family: "'Google Sans', sans-serif",
      size: '14px',
      lineHeight: '16px',
      letterSpacing: '0.0142em',
    },
    tab: {
      family: 'Google Sans',
      size: '14px',
      minSize: '12px',
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
      family: "'Google Sans', sans-serif",
      size: '14px',
      lineHeight: '20px',
      weight: '500',
    },
    pill: {
      family: "'Google Sans', sans-serif",
      weight: 500,
      size: '14px',
      lineHeight: '20px',
      letterSpacing: '0.01em',
    },
    popoverMenu: {
      family: "'Google Sans', sans-serif",
      size: '14px',
      lineHeight: '20px',
      weight: '400',
      letterSpacing: '0.01em',
    },
    dropdown: {
      family: "'Google Sans', sans-serif",
      size: '14px',
      lineHeight: '20px',
      weight: '500',
      letterSpacing: '0.01em',
    },
    storyGridItem: {
      family: "'Google Sans', sans-serif",
      size: '14px',
      lineHeight: '20px',
      weight: '500',
      letterSpacing: '0.01em',
    },
    storyGridItemSub: {
      family: 'Roboto',
      weight: 'normal',
    },
    typeaheadInput: {
      family: "'Google Sans', sans-serif",
      size: '14px',
      lineHeight: '20px',
      weight: '500',
      letterSpacing: '0.01em',
    },
    typeaheadOptions: {
      family: "'Google Sans', sans-serif",
      size: '14px',
      lineHeight: '20px',
      weight: '400',
      letterSpacing: '0.01em',
    },
  },
  pageGutter: {
    desktop: 20,
    min: 10,
  },
  previewWidth: {
    desktop: 221,
    tablet: 189,
    largeDisplayPhone: 162,
    smallDisplayPhone: 185,
    min: 139,
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
