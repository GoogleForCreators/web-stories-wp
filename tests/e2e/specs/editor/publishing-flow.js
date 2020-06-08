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
 * WordPress dependencies
 */
import {
  getEditedPostContent,
  publishPostWithPrePublishChecksDisabled,
  arePrePublishChecksEnabled,
  disablePrePublishChecks,
  enablePrePublishChecks,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { createNewStory } from '../../utils';

describe('Publishing Flow', () => {
  it('should guide me towards creating a new post to embed my story', async () => {
    await createNewStory();

    await expect(page).toMatchElement('input[placeholder="Add title"]');
    await page.type('input[placeholder="Add title"]', 'Publishing Flow Test');

    // Publish story.
    await expect(page).toClick('button', { text: 'Publish' });

    await expect(page).toMatchElement('button', { text: 'Dismiss' });

    // Create new post and embed story.
    await expect(page).toClick('a', { text: 'Add to new post' });
    await page.waitForNavigation();

    await expect(page).toMatchElement('textarea', {
      text: 'Publishing Flow Test',
    });
    expect(await getEditedPostContent()).toMatchSnapshot();

    const werePrePublishChecksEnabled = await arePrePublishChecksEnabled();

    //eslint-disable-next-line jest/no-if
    if (werePrePublishChecksEnabled) {
      await disablePrePublishChecks();
    }

    await publishPostWithPrePublishChecksDisabled();
    await enablePrePublishChecks();

    await expect(page).toClick('a', { text: 'View post' });

    await expect(page).toMatch('Publishing Flow Test');
    await expect(page).toMatchElement('amp-story-player');
  });
});
