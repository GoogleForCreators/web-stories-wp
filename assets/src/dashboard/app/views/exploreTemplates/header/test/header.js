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
import { renderWithProviders } from '../../../../../testUtils';
import LayoutProvider from '../../../../../components/layout/provider';
import Header from '..';

describe('Explore Templates <Header />', function () {
  it('should have results label that says "Viewing all templates" on initial page view', function () {
    const { getByText } = renderWithProviders(
      <LayoutProvider>
        <Header
          filter={{ value: TEMPLATES_GALLERY_STATUS.ALL }}
          totalTemplates={3}
          search={{ keyword: '', setKeyword: jest.fn() }}
          sort={{
            value: TEMPLATES_GALLERY_SORT_OPTIONS.POPULAR,
            set: jest.fn(),
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
        />
      </LayoutProvider>,
      { features: { enableInProgressTemplateActions: false } }
    );

    expect(getByText('Viewing all templates')).toBeInTheDocument();
  });

  it('should call the set sort function when a new sort is selected', function () {
    const setSortFn = jest.fn();
    const { getByLabelText, getByText } = renderWithProviders(
      <LayoutProvider>
        <Header
          filter={{ value: TEMPLATES_GALLERY_STATUS.ALL }}
          totalTemplates={8}
          sort={{
            value: TEMPLATES_GALLERY_SORT_OPTIONS.POPULAR,
            set: setSortFn,
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
        />
      </LayoutProvider>,
      { features: { enableInProgressTemplateActions: true } }
    );
    fireEvent.click(getByLabelText('Choose sort option for display'));
    fireEvent.click(getByText('Recent'));

    expect(setSortFn).toHaveBeenCalledWith('recent');
  });

  it('should not render with search when features:{enableInProgressTemplateActions is false}', function () {
    const { queryByRole } = renderWithProviders(
      <LayoutProvider>
        <Header
          filter={{ value: TEMPLATES_GALLERY_STATUS.ALL }}
          totalTemplates={8}
          sort={{
            value: TEMPLATES_GALLERY_SORT_OPTIONS.POPULAR,
            set: jest.fn,
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
        />
      </LayoutProvider>,
      { features: { enableInProgressTemplateActions: false } }
    );
    expect(queryByRole('textbox')).not.toBeInTheDocument();
  });
});
