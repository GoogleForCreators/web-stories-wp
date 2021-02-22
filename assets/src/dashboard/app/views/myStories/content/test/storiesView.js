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
import { SnackbarProvider } from '../../../../snackbar';
import {
  STORY_SORT_OPTIONS,
  SORT_DIRECTION,
  VIEW_STYLE,
} from '../../../../../constants';
import StoriesView from '../storiesView';

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

describe('My Stories <StoriesView />', function () {
  it(`should render stories as a grid when view is ${VIEW_STYLE.GRID}`, function () {
    const { getAllByTestId } = renderWithProviders(
      <SnackbarProvider>
        <StoriesView
          filterValue="all"
          sort={{
            value: STORY_SORT_OPTIONS.NAME,
            direction: SORT_DIRECTION.ASC,
          }}
          storyActions={{
            createTemplateFromStory: jest.fn,
            duplicateStory: jest.fn,
            trashStory: jest.fn,
            updateStory: jest.fn,
          }}
          stories={fakeStories}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 210, height: 316 },
          }}
        />
      </SnackbarProvider>,
      { features: { enableInProgressStoryActions: false } }
    );

    expect(getAllByTestId(/^story-grid-item/)).toHaveLength(fakeStories.length);
  });
});
