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
import { SavedTemplatesContent, SavedTemplatesHeader } from '../index';
import { renderWithProviders } from '../../../../testUtils';
import formattedTemplatesArray from '../../../../dataUtils/formattedTemplatesArray';
import {
  STORY_SORT_OPTIONS,
  VIEW_STYLE,
  SAVED_TEMPLATES_STATUSES,
} from '../../../../constants';
import LayoutProvider from '../../../../components/layout/provider';

jest.mock(
  '../../../../../edit-story/components/previewPage/previewPage.js',
  () => () => null
);
jest.mock('../../../../app/font/fontProvider.js', () => ({ children }) =>
  children
);

describe('<SavedTemplates />', function () {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call the set sort function when a new sort is selected', async function () {
    const setSortFn = jest.fn();
    const { getAllByText, getByText } = renderWithProviders(
      <LayoutProvider>
        <SavedTemplatesHeader
          filter={{ value: SAVED_TEMPLATES_STATUSES.ALL }}
          templates={formattedTemplatesArray}
          search={{ keyword: '', setKeyword: jest.fn() }}
          sort={{ value: STORY_SORT_OPTIONS.CREATED_BY, set: setSortFn }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
        />
      </LayoutProvider>,
      { features: { enableInProgressStoryActions: false } }
    );
    fireEvent.click(getAllByText('Last modified')[0].parentElement);
    fireEvent.click(getByText('Date created'));

    await waitFor(() => {
      expect(setSortFn).toHaveBeenCalledWith('modified');
    });
  });

  it('should render the content grid with the correct saved template count.', function () {
    const { getAllByText } = renderWithProviders(
      <LayoutProvider>
        <SavedTemplatesContent
          templates={formattedTemplatesArray}
          page={{
            requestNextPage: jest.fn(),
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
        />
      </LayoutProvider>,
      { features: { enableInProgressStoryActions: false } }
    );

    expect(getAllByText('See details')).toHaveLength(
      formattedTemplatesArray.length
    );
  });
});
