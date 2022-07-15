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
import { screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import {
  TEMPLATES_GALLERY_SORT_OPTIONS,
  TEMPLATES_GALLERY_STATUS,
  VIEW_STYLE,
} from '../../../../../constants';
import { renderWithProviders } from '../../../../../testUtils';
import LayoutProvider from '../../../../../components/layout/provider';
import Content from '..';
import { ConfigProvider } from '../../../../config';
import useTemplateFilters from '../../filters/useTemplateFilters';

const fakeTemplates = [
  {
    id: 1,
    slug: 'beauty',
    title: 'Beauty',
    createdBy: 'Google',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus consectetur mauris sodales magna elementum maximus.',
    status: 'template',
    bottomTargetAction: () => {},
  },
  {
    id: 2,
    slug: 'cooking',
    title: 'Cooking',
    createdBy: 'Google',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus consectetur mauris sodales magna elementum maximus.',
    status: 'template',
    bottomTargetAction: () => {},
  },
  {
    id: 3,
    slug: 'fitness',
    title: 'Fitness',
    createdBy: 'Google',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus consectetur mauris sodales magna elementum maximus.',
    status: 'template',
    bottomTargetAction: () => {},
  },
];

jest.mock('../../filters/useTemplateFilters', () => ({
  ...jest.requireActual('../../filters/useTemplateFilters'),
  __esModule: true,
  default: jest.fn(),
}));

const mockUseTemplateFilters = useTemplateFilters;

const updateSort = jest.fn();
const updateFilter = jest.fn();

const mockFilterState = {
  filters: [
    {
      key: 'search',
      filterId: null,
    },
    {
      key: 'status',
      filterId: TEMPLATES_GALLERY_STATUS.ALL,
    },
  ],
  filtersObject: {
    status: TEMPLATES_GALLERY_STATUS.ALL,
  },
  sortObject: {
    orderby: TEMPLATES_GALLERY_SORT_OPTIONS.POPULAR,
  },
  registerFilters: () => {},
  updateFilter,
  updateSort,
};

describe('Explore Templates <Content />', function () {
  beforeEach(() => {
    mockUseTemplateFilters.mockImplementation(() => mockFilterState);
  });

  it('should render the content grid with the correct template count.', function () {
    renderWithProviders(
      <ConfigProvider config={{ cdnURL: 'cdn.example.com' }}>
        <LayoutProvider>
          <Content
            templates={fakeTemplates}
            totalTemplates={3}
            page={{
              requestNextPage: jest.fn,
            }}
            view={{
              style: VIEW_STYLE.GRID,
              pageSize: { width: 200, height: 300 },
            }}
          />
        </LayoutProvider>
      </ConfigProvider>
    );

    const useButtons = screen.getAllByTestId(/^template-grid-item/);

    expect(useButtons).toHaveLength(fakeTemplates.length);
  });

  it('should show "No templates currently available." if no templates are present.', function () {
    renderWithProviders(
      <LayoutProvider>
        <Content
          templates={[]}
          totalTemplates={0}
          page={{
            requestNextPage: jest.fn,
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
        />
      </LayoutProvider>
    );
    expect(
      screen.getByText('No templates currently available.')
    ).toBeInTheDocument();
  });

  it('should show "Sorry, we couldn\'t find any results matching "scooby dooby doo" if no templates are found for a search query are present.', function () {
    renderWithProviders(
      <LayoutProvider>
        <Content
          search={'scooby dooby doo'}
          templates={[]}
          totalTemplates={0}
          page={{
            requestNextPage: jest.fn,
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
        />
      </LayoutProvider>
    );

    expect(
      screen.getByText(
        'Sorry, we couldn\'t find any results matching "scooby dooby doo"'
      )
    ).toBeInTheDocument();
  });
});
