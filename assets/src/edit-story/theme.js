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
import { SCROLLBAR_WIDTH } from './constants';
import { identity, useContextSelector } from './utils/context';

export const GlobalStyle = createGlobalStyle`
	*,
	*::after,
	*::before {
		box-sizing: border-box;
	}

  /* WP admin menu arrow color */
  ul#adminmenu a.wp-has-current-submenu::after {
    border-right-color: ${({ theme }) => theme.colors.bg.v4};
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
    scrollbar-color: ${({ theme }) => theme.colors.bg.v10}
    ${({ theme }) => rgba(theme.colors.bg.v0, 0.1)};
  }

  *::-webkit-scrollbar {
    width: ${SCROLLBAR_WIDTH}px;
    height: ${SCROLLBAR_WIDTH}px;
    position:fixed;
  }

  *::-webkit-scrollbar-track {
    background: ${({ theme }) => rgba(theme.colors.bg.v0, 0.1)};
    border-radius: 6px;
  }

  *::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.bg.v10};
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
  colors: {
    bg: {
      v0: '#000000',
      v1: '#191C28',
      v2: '#202124',
      v3: '#242A3B',
      v4: '#2F3449',
      v5: '#575D65',
      v6: '#1D222F',
      v7: '#07080C',
      v8: '#2A3140',
      v9: '#232636',
      v10: '#44485B',
      v11: '#08223A',
      v12: '#F2F2F2',
      v13: '#FFFFFF',
    },
    mg: {
      v1: '#616877',
      v2: '#DADADA',
    },
    fg: {
      v0: '#000000',
      v1: '#FFFFFF',
      v2: '#E5E5E5',
      v3: '#D4D3D4',
      v4: '#B3B3B3',
      v5: '#DDDDDD',
      v6: '#232636',
      v7: '#1A73E8',
      v8: '#E6E6E6',
    },
    hover: '#4285F4',
    action: '#47A0F4',
    danger: '#FF0000',
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
      lineHeight: '1',
      weight: '500',
    },
    description: {
      family: 'Roboto',
      weight: 'normal',
      size: '13px',
      lineHeight: '16px',
    },
  },
};

export default theme;
