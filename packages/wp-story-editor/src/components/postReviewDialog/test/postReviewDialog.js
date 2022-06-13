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
import {
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { setAppElement } from '@googleforcreators/design-system';
import { StoryContext } from '@googleforcreators/story-editor';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import PostReviewDialog from '..';

function setupButtons({ meta: extraMetaProps } = {}) {
  const storyContextValue = {
    state: {
      meta: { isSaving: false, isFreshlyPending: false, ...extraMetaProps },
      story: {
        status: 'draft',
        storyId: 123,
        date: null,
        editLink: 'http://localhost/wp-admin/post.php?post=123&action=edit',
      },
    },
    actions: { saveStory: jest.fn(), autoSave: jest.fn() },
  };

  renderWithTheme(
    <StoryContext.Provider value={storyContextValue}>
      <PostReviewDialog />
    </StoryContext.Provider>
  );
}

describe('buttons', () => {
  let modalWrapper;

  beforeAll(() => {
    modalWrapper = document.createElement('aside');
    document.documentElement.appendChild(modalWrapper);
    setAppElement(modalWrapper);
  });

  afterAll(() => {
    document.documentElement.removeChild(modalWrapper);
  });

  it('should display post-review dialog if recently published and in review', async () => {
    setupButtons({ meta: { isFreshlyPending: true } });

    const dismissButton = screen.getByRole('button', { name: 'Dismiss' });
    expect(dismissButton).toBeInTheDocument();
    fireEvent.click(dismissButton);

    await waitForElementToBeRemoved(() =>
      screen.queryByRole('button', { name: 'Dismiss' })
    );
  });
});
