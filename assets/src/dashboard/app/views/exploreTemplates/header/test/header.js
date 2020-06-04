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
import { fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import {
  TEMPLATES_GALLERY_STATUS,
  VIEW_STYLE,
  TEMPLATES_GALLERY_SORT_OPTIONS,
} from '../../../../../constants';
import { renderWithTheme } from '../../../../../testUtils';
import LayoutProvider from '../../../../../components/layout/provider';
import Header from '../';

const fakeTemplates = [
  {
    id: 1,
    title: 'Beauty',
    createdBy: 'Google Web Stories',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus consectetur mauris sodales magna elementum maximus.',
    status: 'template',
    pages: [{ id: '10' }],
    centerTargetAction: () => {},
    bottomTargetAction: () => {},
  },
  {
    id: 2,
    title: 'Cooking',
    createdBy: 'Google Web Stories',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus consectetur mauris sodales magna elementum maximus.',
    status: 'template',
    pages: [{ id: '20' }],
    centerTargetAction: () => {},
    bottomTargetAction: () => {},
  },
  {
    id: 3,
    title: 'Fitness',
    createdBy: 'Google Web Stories',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus consectetur mauris sodales magna elementum maximus.',
    status: 'template',
    pages: [{ id: '30' }],
    centerTargetAction: () => {},
    bottomTargetAction: () => {},
  },
];

describe('Explore Templates <Header />', function () {
  it('should have results label that says "Viewing all templates" on initial page view', function () {
    const { getByText } = renderWithTheme(
      <LayoutProvider>
        <Header
          filter={{ value: TEMPLATES_GALLERY_STATUS.ALL }}
          totalTemplates={3}
          search={{ keyword: '', setKeyword: jest.fn() }}
          templates={fakeTemplates}
          sort={{
            value: TEMPLATES_GALLERY_SORT_OPTIONS.POPULAR,
            set: jest.fn(),
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
        />
      </LayoutProvider>
    );

    expect(getByText('Viewing all templates')).toBeInTheDocument();
  });

  it('should render with the correct count label and search keyword.', function () {
    const { getByPlaceholderText, getByText } = renderWithTheme(
      <LayoutProvider>
        <Header
          filter={{ value: TEMPLATES_GALLERY_STATUS.ALL }}
          totalTemplates={8}
          search={{ keyword: 'Harry Potter', setKeyword: jest.fn }}
          templates={fakeTemplates}
          sort={{
            value: TEMPLATES_GALLERY_SORT_OPTIONS.POPULAR,
            set: jest.fn,
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
        />
      </LayoutProvider>
    );
    expect(getByPlaceholderText('Search Templates').value).toBe('Harry Potter');
    expect(getByText('8 results')).toBeInTheDocument();
  });

  it('should call the set keyword function when new text is searched', function () {
    const setKeywordFn = jest.fn();
    const { getByPlaceholderText } = renderWithTheme(
      <LayoutProvider>
        <Header
          filter={{ value: TEMPLATES_GALLERY_STATUS.ALL }}
          totalTemplates={8}
          search={{ keyword: 'Harry Potter', setKeyword: setKeywordFn }}
          templates={fakeTemplates}
          sort={{
            value: TEMPLATES_GALLERY_SORT_OPTIONS.POPULAR,
            set: jest.fn,
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
        />
      </LayoutProvider>
    );
    fireEvent.change(getByPlaceholderText('Search Templates'), {
      target: { value: 'Hermione Granger' },
    });
    expect(setKeywordFn).toHaveBeenCalledWith('Hermione Granger');
  });

  it('should call the set sort function when a new sort is selected', function () {
    const setSortFn = jest.fn();
    const { getAllByText, getByText } = renderWithTheme(
      <LayoutProvider>
        <Header
          filter={{ value: TEMPLATES_GALLERY_STATUS.ALL }}
          totalTemplates={8}
          search={{ keyword: 'Harry Potter', setKeyword: jest.fn }}
          templates={fakeTemplates}
          sort={{
            value: TEMPLATES_GALLERY_SORT_OPTIONS.POPULAR,
            set: setSortFn,
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
        />
      </LayoutProvider>
    );
    fireEvent.click(getAllByText('Popular')[0].parentElement);
    fireEvent.click(getByText('Recent'));

    expect(setSortFn).toHaveBeenCalledWith('recent');
  });
});
