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
export const GlobalStyle = createGlobalStyle`
  @import url(//fonts.googleapis.com/css?family=Google+Sans);
	*,
	*::after,
	*::before {
		box-sizing: border-box;
    }
    
    h1 {
      font-family: 'Google Sans', 'Roboto', sans-serif;
    }
`;

export function useTheme() {
  return useContext(ThemeContext);
}

const theme = {
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
      weight: '500',
    },
    label: {
      family: 'Roboto',
      size: '15px',
      lineHeight: '18px',
      weight: '400',
    },
  },
};

export default theme;
