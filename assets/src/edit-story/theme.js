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
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
import {
  identity,
  useContextSelector,
  theme as designSystemTheme,
} from '../design-system';
import { SCROLLBAR_WIDTH } from './constants';

export const GlobalStyle = createGlobalStyle`
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }

  /* WP admin menu arrow color */
  ul#adminmenu a.wp-has-current-submenu::after {
    border-right-color: ${({ theme }) =>
      theme.DEPRECATED_THEME.colors.bg.panel};
  }

  /**
   * Override the shell (WP) the default styling used for stories content.
   */
  .web-stories-content b, .web-stories-content strong {
    font-weight: bold;
  }

  /*
   * Custom dark scrollbars for Chromium & Firefox.
   * Scoped to <Editor> to make sure we don't mess with WP dialogs
   * like the Backbone Media Gallery dialog.
   */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.bg.primary}
    ${({ theme }) => rgba(theme.DEPRECATED_THEME.colors.bg.black, 0.1)};
  }

  *::-webkit-scrollbar {
    width: ${SCROLLBAR_WIDTH}px;
    height: ${SCROLLBAR_WIDTH}px;
    position:fixed;
  }

  *::-webkit-scrollbar-track {
    background: ${({ theme }) =>
      rgba(theme.DEPRECATED_THEME.colors.bg.black, 0.1)};
    border-radius: 6px;
  }

  *::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) =>
      rgba(theme.DEPRECATED_THEME.colors.bg.divider, 0.04)};
    width: 3px;
    border-radius: 6px;
    border: 2px solid transparent;
    background-clip: content-box;
  }
`;

export function useTheme(selector) {
  return useContextSelector(ThemeContext, selector ?? identity);
}

const theme = {
  ...designSystemTheme,
  DEPRECATED_THEME: {
    colors: {
      bg: {
        // Note: amp-story-page background color matches workspace background color.
        workspace: '#1B1D1C',
        panel: '#282A2A',
        white: '#FFFFFF',
        black: '#000000',
        divider: '#FFFFFF',

        // Legacy
        // v0: '#000000', <=> replaced with 'black'
        // v1: '#1B1D1C', <=> replaced with 'workspace'
        v2: '#202124',
        v3: '#242A3B',
        // v4: '#282A2A', <=> replaced with 'panel'
        v5: '#575D65',
        v6: '#1D222F',
        v7: '#07080C',
        v8: '#2A3140',
        v9: '#232636',
        v10: '#44485B',
        v11: '#08223A',
        v12: '#F2F2F2',
        // v13: '#FFFFFF', <=> replaced with 'white'
        v14: '#3E445B',
        v15: '#212433',
        v16: '#2C2C2C',
      },
      mg: {
        v1: '#616877',
        v2: '#DADADA',
      },
      fg: {
        black: '#000000',
        white: '#FFFFFF',
        primary: '#EDEFEC',
        secondary: '#A1A09B',
        tertiary: '#767570',
        gray24: '#5E615C',
        gray16: '#414442',
        gray8: '#2F3131',
        negative: '#E45F53',
        positive: '#81C995',
        warning: '#F4B844',

        // v0: '#000000', <=> replaced with fg.black
        // v1: '#FFFFFF', <=> replaced with fg.white
        v2: '#E5E5E5',
        v3: '#D4D3D4',
        v4: '#B3B3B3',
        v5: '#DDDDDD',
        v6: '#232636',
        // v7: '#1A73E8', <=> replaced with accent.primary
        v8: '#E6E6E6',
        v9: '#4D4E53',
      },
      hover: '#4285F4',
      accent: {
        primary: '#1A73E8',
        secondary: '#8AB4F8',
      },
      activeDirection: '#dd8162',
      // action: '#1A73E8', <=> replaced by accent.primary
      danger: '#FF0000',
      callout: '#FF00F5',
      warning: '#EA4335',
      radio: '#1A73E8',
      required: '#FF9797',
      selection: '#44aaff',
      success: { v0: '#14FF00' },
      textHighlight: '#EDFF7C',
      grayout: 'rgba(0, 0, 0, 0.5)',
      whiteout: 'rgba(255, 255, 255, 0.5)',
      loading: {
        primary: '#4285F4',
        secondary: '#15D8FD',
      },
      link: '#4285f4',
      t: {
        bg: '#000000CC',
        fg: '#FFFFFFCC',
      },
      outline: '#686868',
      input: '#1c1d1d',
    },
    fonts: {
      title: {
        family: 'Roboto',
        size: '18px',
        lineHeight: '24px',
        weight: 'bold',
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
        family: 'Roboto',
        size: '12px',
        lineHeight: '1.2',
        weight: '500',
      },
      label: {
        family: 'Roboto',
        size: '15px',
        lineHeight: '18px',
        weight: '400',
      },
      input: {
        family: 'Roboto',
        size: '15px',
        lineHeight: '18px',
        weight: '400',
      },
      duration: {
        family: 'Roboto',
        size: '12px',
        lineHeight: '20px',
      },
      description: {
        family: 'Roboto',
        weight: 'normal',
        size: '13px',
        lineHeight: '18px',
      },
      date: {
        family: 'Roboto',
        weight: 'normal',
        size: '13px',
        lineHeight: '24px',
      },
      mediaError: {
        family: 'Roboto',
        style: 'italic',
        weight: 'normal',
        size: '16px',
        lineHeight: '24px',
        textAlign: 'center',
      },
      version: {
        family: 'Roboto',
        size: '12px',
        lineHeight: '20px',
        letterSpacing: '0.0133em',
      },
      paragraph: {
        small: {
          family: 'Roboto',
          size: '14px',
          lineHeight: '20px',
        },
      },
    },
    border: {
      radius: {
        default: '4px',
      },
    },
  },
};

export default theme;
