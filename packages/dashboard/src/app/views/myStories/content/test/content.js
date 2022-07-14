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
import { SnackbarProvider } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { renderWithProviders } from '../../../../../testUtils';
import { VIEW_STYLE, STORY_STATUSES } from '../../../../../constants';
import LayoutProvider from '../../../../../components/layout/provider';
import Content from '..';

const fakeStories = [
  {
    id: 1,
    status: 'publish',
    title: 'Story A',
    pages: [{ id: '10', elements: [] }],
    bottomTargetAction: 'https://example.com',
    link: 'https://example.com',
    editStoryLink: 'https://example.com',
    previewLink: 'https://example.com',
    capabilities: {
      hasDeleteAction: false,
      hasEditAction: false,
    },
  },
  {
    id: 2,
    status: 'draft',
    title: 'Story B',
    pages: [{ id: '20', elements: [] }],
    bottomTargetAction: 'https://example.com',
    link: 'https://example.com',
    editStoryLink: 'https://example.com',
    previewLink: 'https://example.com',
    capabilities: {
      hasDeleteAction: false,
      hasEditAction: false,
    },
  },
  {
    id: 3,
    status: 'publish',
    title: 'Story C',
    pages: [{ id: '30', elements: [] }],
    bottomTargetAction: 'https://example.com',
    link: 'https://example.com',
    editStoryLink: 'https://example.com',
    previewLink: 'https://example.com',
    capabilities: {
      hasDeleteAction: false,
      hasEditAction: false,
    },
  },
];
const pageSize = {
  width: 200,
  height: 300,
};

describe('Dashboard <Content />', function () {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the content grid with the correct story count.', function () {
    renderWithProviders(
      <SnackbarProvider>
        <LayoutProvider>
          <Content
            stories={fakeStories}
            page={{
              requestNextPage: jest.fn,
            }}
            view={{
              style: VIEW_STYLE.GRID,
              pageSize,
            }}
            storyActions={{
              duplicateStory: jest.fn,
              trashStory: jest.fn,
              updateStory: jest.fn,
            }}
          />
        </LayoutProvider>
      </SnackbarProvider>
    );

    expect(screen.getAllByTestId(/^story-grid-item/)).toHaveLength(
      fakeStories.length
    );
  });

  it('should show "Start telling Stories." if no stories are present.', function () {
    renderWithProviders(
      <SnackbarProvider>
        <LayoutProvider>
          <Content
            stories={[]}
            page={{
              requestNextPage: jest.fn,
            }}
            view={{
              style: VIEW_STYLE.GRID,
              pageSize,
            }}
            storyActions={{
              duplicateStory: jest.fn,
              trashStory: jest.fn,
              updateStory: jest.fn,
            }}
          />
        </LayoutProvider>
      </SnackbarProvider>
    );

    expect(screen.getByText('Start telling Stories.')).toBeInTheDocument();
  });

  it('should show "Sorry, we couldn\'t find any results matching "scooby dooby doo" if no stories are found for a search query are present.', function () {
    renderWithProviders(
      <SnackbarProvider>
        <LayoutProvider>
          <Content
            filtersObject={{
              search: 'scooby dooby doo',
              status: STORY_STATUSES[0],
            }}
            stories={[]}
            page={{
              requestNextPage: jest.fn,
            }}
            view={{
              style: VIEW_STYLE.GRID,
              pageSize,
            }}
            storyActions={{
              duplicateStory: jest.fn,
              trashStory: jest.fn,
              updateStory: jest.fn,
            }}
          />
        </LayoutProvider>
      </SnackbarProvider>
    );

    expect(
      screen.getByText(
        'Sorry, we couldn\'t find any results matching "scooby dooby doo"'
      )
    ).toBeInTheDocument();
  });

  it('should show "Sorry, we couldn\'t find any results if no stories are found for a filter query are present.', function () {
    renderWithProviders(
      <SnackbarProvider>
        <LayoutProvider>
          <Content
            stories={[]}
            filtersObject={{
              sports: 2,
            }}
            page={{
              requestNextPage: jest.fn,
            }}
            view={{
              style: VIEW_STYLE.GRID,
              pageSize,
            }}
            storyActions={{
              duplicateStory: jest.fn,
              trashStory: jest.fn,
              updateStory: jest.fn,
            }}
          />
        </LayoutProvider>
      </SnackbarProvider>
    );

    expect(
      screen.getByText("Sorry, we couldn't find any results")
    ).toBeInTheDocument();
  });
});
