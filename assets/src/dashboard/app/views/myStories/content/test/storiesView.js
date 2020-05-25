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
import { renderWithTheme } from '../../../../../testUtils';

import { STORY_SORT_OPTIONS, SORT_DIRECTION } from '../../../../../constants';
import StoriesView from '../storiesView';

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

describe('My Stories <StoriesView />', function () {
  it('should render stories as a grid by default', function () {
    const { getAllByTestId } = renderWithTheme(
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
        users={{}}
      />
    );

    expect(getAllByTestId('grid-item')).toHaveLength(fakeStories.length);
  });
});
