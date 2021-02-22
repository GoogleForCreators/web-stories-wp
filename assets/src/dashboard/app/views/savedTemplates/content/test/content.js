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
import { renderWithProviders } from '../../../../../testUtils';
import { formattedTemplatesArray } from '../../../../../storybookUtils';
import { VIEW_STYLE, SAVED_TEMPLATES_STATUSES } from '../../../../../constants';
import LayoutProvider from '../../../../../components/layout/provider';
import { SnackbarProvider } from '../../../../snackbar';
import Content from '../';

jest.mock(
  '../../../../../../edit-story/components/previewPage/previewPage.js',
  () => () => null
);
jest.mock('../../../../../app/font/fontProvider.js', () => ({ children }) =>
  children
);

describe('Saved Templates <Content />', function () {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the content grid with the correct saved template count.', function () {
    const { getAllByTestId } = renderWithProviders(
      <SnackbarProvider>
        <LayoutProvider>
          <Content
            filter={SAVED_TEMPLATES_STATUSES[0]}
            search={{ keyword: '' }}
            templates={formattedTemplatesArray}
            page={{
              requestNextPage: jest.fn,
            }}
            view={{
              style: VIEW_STYLE.GRID,
              pageSize: { width: 200, height: 300 },
            }}
            actions={{
              createStoryFromTemplate: jest.fn,
              previewTemplate: jest.fn,
            }}
          />
        </LayoutProvider>
      </SnackbarProvider>,
      { features: { enableInProgressStoryActions: false } }
    );

    expect(getAllByTestId(/^story-grid-item/)).toHaveLength(
      formattedTemplatesArray.length
    );
  });

  it('should show "Bookmark a story or template to get started!" if no saved templates are present.', function () {
    const { getByText } = renderWithProviders(
      <SnackbarProvider>
        <LayoutProvider>
          <Content
            filter={SAVED_TEMPLATES_STATUSES[0]}
            search={{ keyword: '' }}
            templates={[]}
            page={{
              requestNextPage: jest.fn,
            }}
            view={{
              style: VIEW_STYLE.GRID,
              pageSize: { width: 200, height: 300 },
            }}
            actions={{
              createStoryFromTemplate: jest.fn,
              previewTemplate: jest.fn,
            }}
          />
        </LayoutProvider>
      </SnackbarProvider>,
      { features: { enableInProgressStoryActions: false } }
    );

    expect(
      getByText('Bookmark a story or template to get started!')
    ).toBeInTheDocument();
  });

  it('should show "Sorry, we couldn\'t find any results matching "scooby dooby doo" if no saved templates are found for a search query are present.', function () {
    const { getByText } = renderWithProviders(
      <SnackbarProvider>
        <LayoutProvider>
          <Content
            filter={SAVED_TEMPLATES_STATUSES[0]}
            search={{ keyword: 'scooby dooby doo' }}
            templates={[]}
            page={{
              requestNextPage: jest.fn,
            }}
            view={{
              style: VIEW_STYLE.GRID,
              pageSize: { width: 200, height: 300 },
            }}
            actions={{
              createStoryFromTemplate: jest.fn,
              previewTemplate: jest.fn,
            }}
          />
        </LayoutProvider>
      </SnackbarProvider>,
      { features: { enableInProgressStoryActions: false } }
    );

    expect(
      getByText(
        'Sorry, we couldn\'t find any results matching "scooby dooby doo"'
      )
    ).toBeInTheDocument();
  });
});
