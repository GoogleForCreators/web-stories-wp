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
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import theme from '../../../theme';

import BookmarkChip from '../';

const wrapper = (children) => {
  return render(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
};

describe('BookmarkChip', () => {
  it('should render a <BookmarkChip />', () => {
    const { getByRole } = wrapper(<BookmarkChip />);

    expect(getByRole('button')).toBeDefined();
  });

  it('should render `not-bookmarked` when `isBookmarked` is false', () => {
    const { queryByTestId } = wrapper(<BookmarkChip />);

    expect(queryByTestId('not-bookmarked')).toBeDefined();
    expect(queryByTestId('is-bookmarked')).toBeNull();
  });

  it('should render `is-bookmarked` when `isBookmarked` is true', () => {
    const { queryByTestId } = wrapper(<BookmarkChip isBookmarked={true} />);

    expect(queryByTestId('is-bookmarked')).toBeDefined();
    expect(queryByTestId('not-bookmarked')).toBeNull();
  });
});
