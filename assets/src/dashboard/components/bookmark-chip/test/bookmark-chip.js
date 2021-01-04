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
 * Internal dependencies
 */
import BookmarkChip from '../';
import { renderWithProviders } from '../../../testUtils/';

describe('BookmarkChip', () => {
  it('should render a <BookmarkChip />', () => {
    const { getByRole } = renderWithProviders(<BookmarkChip />);

    expect(getByRole('button')).toBeInTheDocument();
  });

  it('should render `not-bookmarked` when `isBookmarked` is false', () => {
    const { queryByTestId } = renderWithProviders(<BookmarkChip />);

    expect(queryByTestId('not-bookmarked')).toBeInTheDocument();
    expect(queryByTestId('is-bookmarked')).not.toBeInTheDocument();
  });

  it('should render `is-bookmarked` when `isBookmarked` is true', () => {
    const { queryByTestId } = renderWithProviders(
      <BookmarkChip isBookmarked={true} />
    );

    expect(queryByTestId('is-bookmarked')).toBeInTheDocument();
    expect(queryByTestId('not-bookmarked')).not.toBeInTheDocument();
  });
});
