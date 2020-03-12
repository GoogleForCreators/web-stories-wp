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

  /* WP admin menu arrow color */
  ul#adminmenu a.wp-has-current-submenu::after {
    border-right-color: ${({ theme }) => theme.colors.bg.v4};
  }
`;

export function useTheme() {
  return useContext(ThemeContext);
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
    },
    action: '#47A0F4',
    danger: '#FF0000',
    selection: '#44aaff',
    grayout: 'rgba(0, 0, 0, 0.5)',
    whiteout: 'rgba(255, 255, 255, 0.5)',
    t: {
      bg: '#000000CC',
      fg: '#FFFFFFCC',
    },
  },
  fonts: {
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
    duration: {
      family: 'Roboto',
      size: '12px',
      lineHeight: '1',
      weight: '500',
    },
  },
};

export default theme;
