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
import { fireEvent, waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
import {
  SAVED_TEMPLATES_STATUSES,
  STORY_SORT_OPTIONS,
  VIEW_STYLE,
} from '../../../../../constants';
import formattedTemplatesArray from '../../../../../dataUtils/formattedTemplatesArray';
import LayoutProvider from '../../../../../components/layout/provider';
import { renderWithProviders } from '../../../../../testUtils';
import Header from '../';

describe('My Stories <Header />', function () {
  it('should have results label that says "Viewing all templates" on initial page view', function () {
    const { getByText } = renderWithProviders(
      <LayoutProvider>
        <Header
          filter={SAVED_TEMPLATES_STATUSES[0]}
          templates={formattedTemplatesArray}
          search={{ keyword: '', setKeyword: jest.fn() }}
          sort={{ value: STORY_SORT_OPTIONS.NAME, set: jest.fn() }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
        />
      </LayoutProvider>
    );
    expect(getByText('Viewing all templates')).toBeInTheDocument();
  });

  it('should call the set sort function when a new sort is selected', async function () {
    const setSortFn = jest.fn();
    const { getAllByText, getByText } = renderWithProviders(
      <LayoutProvider>
        <Header
          filter={SAVED_TEMPLATES_STATUSES[0]}
          templates={formattedTemplatesArray}
          search={{ keyword: 'DIY Template', setKeyword: jest.fn() }}
          sort={{ value: STORY_SORT_OPTIONS.NAME, set: setSortFn }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
        />
      </LayoutProvider>
    );
    fireEvent.click(getAllByText('Last modified')[0].parentElement);
    fireEvent.click(getByText('Date created'));

    await waitFor(() => {
      expect(setSortFn).toHaveBeenCalledWith('modified');
    });
  });
});
