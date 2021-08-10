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
import { theme, themeHelpers } from '@web-stories-wp/design-system';
import { identity, useContextSelector } from '@web-stories-wp/react';

export const GlobalStyle = createGlobalStyle`
  /* WP admin menu arrow color */
  ul#adminmenu a.wp-has-current-submenu::after {
    border-right-color: ${theme.colors.bg.secondary};
  }

  /**
   * Override the shell (WP) the default styling used for stories content.
   */
  .web-stories-content b, .web-stories-content strong {
    font-weight: bold;
  }

  /*
   * Scrollbars are scoped to <Editor> to make sure we don't mess with
   * WP dialogs like the Backbone Media Gallery dialog.
   */
  body.edit-story #wpbody * {
    ${themeHelpers.scrollbarCSS};
  }
`;

export function useTheme(selector) {
  return useContextSelector(ThemeContext, selector ?? identity);
}

export default theme;
