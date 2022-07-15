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
import { fireEvent, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import {
  TEMPLATES_GALLERY_STATUS,
  VIEW_STYLE,
  TEMPLATES_GALLERY_SORT_OPTIONS,
} from '../../../../../constants';
import { renderWithProviders } from '../../../../../testUtils';
import LayoutProvider from '../../../../../components/layout/provider';
import useTemplateFilters from '../../filters/useTemplateFilters';
import Header from '..';

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

describe('Explore Templates <Header />', function () {
  beforeEach(() => {
    mockUseTemplateFilters.mockImplementation(() => mockFilterState);
  });

  it('should have results label that says "Viewing all templates" on initial page view', function () {
    renderWithProviders(
      <LayoutProvider>
        <Header
          totalTemplates={3}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
        />
      </LayoutProvider>,
      { features: { enableInProgressTemplateActions: false } }
    );

    expect(screen.getByText('Viewing all templates')).toBeInTheDocument();
  });

  it('should call the set sort function when a new sort is selected', function () {
    renderWithProviders(
      <LayoutProvider>
        <Header
          totalTemplates={8}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
        />
      </LayoutProvider>,
      { features: { enableInProgressTemplateActions: true } }
    );
    fireEvent.click(screen.getByLabelText('Choose sort option for display'));
    fireEvent.click(screen.getByText('Recent'));

    expect(updateSort).toHaveBeenCalledWith({ orderby: 'recent' });
  });

  it('should not render with search when features:{enableInProgressTemplateActions is false}', function () {
    renderWithProviders(
      <LayoutProvider>
        <Header
          totalTemplates={8}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
        />
      </LayoutProvider>,
      { features: { enableInProgressTemplateActions: false } }
    );
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
