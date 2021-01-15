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
import { TEMPLATES_GALLERY_STATUS, VIEW_STYLE } from '../../../../../constants';
import { renderWithProviders } from '../../../../../testUtils';
import LayoutProvider from '../../../../../components/layout/provider';
import Content from '../';

const fakeTemplates = [
  {
    id: 1,
    title: 'Beauty',
    createdBy: 'Google',
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
    createdBy: 'Google',
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
    createdBy: 'Google',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus consectetur mauris sodales magna elementum maximus.',
    status: 'template',
    pages: [{ id: '30' }],
    centerTargetAction: () => {},
    bottomTargetAction: () => {},
  },
];

jest.mock(
  '../../../../../../edit-story/components/previewPage/previewPage.js',
  () => () => null
);
jest.mock('../../../../../app/font/fontProvider.js', () => ({ children }) =>
  children
);

describe('Explore Templates <Content />', function () {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the content grid with the correct template count.', function () {
    const { getAllByTestId } = renderWithProviders(
      <LayoutProvider>
        <Content
          filter={{ view: TEMPLATES_GALLERY_STATUS.ALL }}
          search={{ keyword: '' }}
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
    );

    const useButtons = getAllByTestId(/^template-grid-item/);

    expect(useButtons).toHaveLength(fakeTemplates.length);
  });

  it('should show "No templates currently available" if no templates are present.', function () {
    const { getByText } = renderWithProviders(
      <LayoutProvider>
        <Content
          filter={{ view: TEMPLATES_GALLERY_STATUS.ALL }}
          search={{ keyword: '' }}
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
    expect(getByText('No templates currently available')).toBeInTheDocument();
  });

  it('should show "Sorry, we couldn\'t find any results matching "scooby dooby doo" if no templates are found for a search query are present.', function () {
    const { getByText } = renderWithProviders(
      <LayoutProvider>
        <Content
          filter={{ view: TEMPLATES_GALLERY_STATUS.ALL }}
          search={{ keyword: 'scooby dooby doo' }}
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
      getByText(
        'Sorry, we couldn\'t find any results matching "scooby dooby doo"'
      )
    ).toBeInTheDocument();
  });
});
