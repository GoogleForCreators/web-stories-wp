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
import { render, queries, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@googleforcreators/design-system';
import type { PropsWithChildren, ReactElement } from 'react';

/**
 * Internal dependencies
 */
import * as ariaLabelQueries from './queryByAriaLabel';
import * as autoAdvanceAfterQueries from './queryByAutoAdvanceAfter';
import * as idQueries from './queryById';

const WithThemeProvider = ({ children }: PropsWithChildren<unknown>) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

function renderWithTheme(ui: ReactElement, options: Partial<Omit<RenderOptions, 'queries'>>) {
  return render(ui, {
    wrapper: WithThemeProvider,
    queries: {
      ...queries,
      ...ariaLabelQueries,
      ...autoAdvanceAfterQueries,
      ...idQueries,
    },
    ...options,
  });
}

export default renderWithTheme;
