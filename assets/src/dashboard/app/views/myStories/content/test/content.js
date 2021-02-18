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

import { VIEW_STYLE, STORY_STATUSES } from '../../../../../constants';
import LayoutProvider from '../../../../../components/layout/provider';
import { SnackbarProvider } from '../../../../snackbar';
import Content from '../';

const fakeStories = [
  {
    id: 1,
    status: 'publish',
    title: 'Story A',
    pages: [{ id: '10' }],
    centerTargetAction: () => {},
    bottomTargetAction: () => {},
    editStoryLink: () => {},
  },
  {
    id: 2,
    status: 'draft',
    title: 'Story B',
    pages: [{ id: '20' }],
    centerTargetAction: () => {},
    bottomTargetAction: () => {},
    editStoryLink: () => {},
  },
  {
    id: 3,
    status: 'publish',
    title: 'Story C',
    pages: [{ id: '30' }],
    centerTargetAction: () => {},
    bottomTargetAction: () => {},
    editStoryLink: () => {},
  },
];

jest.mock(
  '../../../../../../edit-story/components/previewPage/previewPage.js',
  () => () => null
);
jest.mock('../../../../../app/font/fontProvider.js', () => ({ children }) =>
  children
);

describe('My Stories <Content />', function () {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the content grid with the correct story count.', function () {
    const { getAllByTestId } = renderWithProviders(
      <SnackbarProvider>
        <LayoutProvider>
          <Content
            filter={STORY_STATUSES[0]}
            search={{ keyword: '' }}
            stories={fakeStories}
            page={{
              requestNextPage: jest.fn,
            }}
            view={{
              style: VIEW_STYLE.GRID,
              pageSize: { width: 200, height: 300 },
            }}
            storyActions={{
              createTemplateFromStory: jest.fn,
              duplicateStory: jest.fn,
              trashStory: jest.fn,
              updateStory: jest.fn,
            }}
          />
        </LayoutProvider>
      </SnackbarProvider>,
      { features: { enableInProgressStoryActions: false } }
    );

    expect(getAllByTestId(/^story-grid-item/)).toHaveLength(fakeStories.length);
  });

  it('should show "Create a story to get started!" if no stories are present.', function () {
    const { getByText } = renderWithProviders(
      <SnackbarProvider>
        <LayoutProvider>
          <Content
            filter={STORY_STATUSES[0]}
            search={{ keyword: '' }}
            stories={[]}
            page={{
              requestNextPage: jest.fn,
            }}
            view={{
              style: VIEW_STYLE.GRID,
              pageSize: { width: 200, height: 300 },
            }}
            storyActions={{
              createTemplateFromStory: jest.fn,
              duplicateStory: jest.fn,
              trashStory: jest.fn,
              updateStory: jest.fn,
            }}
          />
        </LayoutProvider>
      </SnackbarProvider>,
      { features: { enableInProgressStoryActions: false } }
    );

    expect(getByText('Create a story to get started!')).toBeInTheDocument();
  });

  it('should show "Sorry, we couldn\'t find any results matching "scooby dooby doo" if no stories are found for a search query are present.', function () {
    const { getByText } = renderWithProviders(
      <SnackbarProvider>
        <LayoutProvider>
          <Content
            filter={STORY_STATUSES[0]}
            search={{ keyword: 'scooby dooby doo' }}
            stories={[]}
            page={{
              requestNextPage: jest.fn,
            }}
            view={{
              style: VIEW_STYLE.GRID,
              pageSize: { width: 200, height: 300 },
            }}
            storyActions={{
              createTemplateFromStory: jest.fn,
              duplicateStory: jest.fn,
              trashStory: jest.fn,
              updateStory: jest.fn,
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
