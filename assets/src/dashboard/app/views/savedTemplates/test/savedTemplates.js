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
/**
 * External dependencies
 */
import { fireEvent } from '@testing-library/react';
import { SavedTemplatesContent, SavedTemplatesHeader } from '../index';
import { renderWithThemeAndFlagsProvider } from '../../../../testUtils';
import {
  STORY_SORT_OPTIONS,
  VIEW_STYLE,
  SAVED_TEMPLATES_STATUSES,
} from '../../../../constants';
import LayoutProvider from '../../../../components/layout/provider';

const fakeStories = [
  {
    id: 1,
    status: 'publish',
    title: 'Story A',
    pages: [{ id: '10' }],
    centerTargetAction: () => {},
    bottomTargetAction: () => {},
  },
  {
    id: 2,
    status: 'draft',
    title: 'Story B',
    pages: [{ id: '20' }],
    centerTargetAction: () => {},
    bottomTargetAction: () => {},
  },
  {
    id: 3,
    status: 'publish',
    title: 'Story C',
    pages: [{ id: '30' }],
    centerTargetAction: () => {},
    bottomTargetAction: () => {},
  },
];

jest.mock('../../../../components/previewPage.js', () => () => null);
jest.mock('../../../../app/font/fontProvider.js', () => ({ children }) =>
  children
);

describe('<SavedTemplates />', function () {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render with the correct count label and search keyword.', function () {
    const { getByPlaceholderText, getByText } = renderWithThemeAndFlagsProvider(
      <LayoutProvider>
        <SavedTemplatesHeader
          filter={{ value: SAVED_TEMPLATES_STATUSES.ALL }}
          stories={fakeStories}
          search={{ keyword: 'Harry Potter', setKeyword: jest.fn() }}
          sort={{ value: STORY_SORT_OPTIONS.NAME, set: jest.fn() }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
        />
      </LayoutProvider>,
      { enableInProgressStoryActions: false }
    );
    expect(getByPlaceholderText('Search Templates').value).toBe('Harry Potter');
    expect(getByText('3 results')).toBeInTheDocument();
  });

  it('should call the set keyword function when new text is searched', function () {
    const setKeywordFn = jest.fn();
    const { getByPlaceholderText } = renderWithThemeAndFlagsProvider(
      <LayoutProvider>
        <SavedTemplatesHeader
          filter={{ value: SAVED_TEMPLATES_STATUSES.ALL }}
          stories={fakeStories}
          search={{ keyword: 'Harry Potter', setKeyword: setKeywordFn }}
          sort={{ value: STORY_SORT_OPTIONS.NAME, set: jest.fn() }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
        />
      </LayoutProvider>,
      { enableInProgressStoryActions: false }
    );
    fireEvent.change(getByPlaceholderText('Search Templates'), {
      target: { value: 'Hermione Granger' },
    });
    expect(setKeywordFn).toHaveBeenCalledWith('Hermione Granger');
  });

  it('should call the set sort function when a new sort is selected', function () {
    const setSortFn = jest.fn();
    const { getAllByText, getByText } = renderWithThemeAndFlagsProvider(
      <LayoutProvider>
        <SavedTemplatesHeader
          filter={{ value: SAVED_TEMPLATES_STATUSES.ALL }}
          stories={fakeStories}
          search={{ keyword: 'Harry Potter', setKeyword: jest.fn() }}
          sort={{ value: STORY_SORT_OPTIONS.CREATED_BY, set: setSortFn }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
        />
      </LayoutProvider>,
      { enableInProgressStoryActions: false }
    );
    fireEvent.click(getAllByText('Created by')[0].parentElement);
    fireEvent.click(getByText('Last modified'));

    expect(setSortFn).toHaveBeenCalledWith('modified');
  });

  it('should render the content grid with the correct story count.', function () {
    const { getAllByText } = renderWithThemeAndFlagsProvider(
      <LayoutProvider>
        <SavedTemplatesContent
          stories={fakeStories}
          page={{
            requestNextPage: jest.fn(),
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
        />
      </LayoutProvider>,
      { enableInProgressStoryActions: false }
    );

    expect(getAllByText('Use template')).toHaveLength(fakeStories.length);
  });
});
