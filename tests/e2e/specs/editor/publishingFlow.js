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
import { createNewStory, addRequestInterception } from '../../utils';

describe('Publishing Flow', () => {
  let stopRequestInterception;

  beforeAll(async () => {
    await page.setRequestInterception(true);
    stopRequestInterception = addRequestInterception((request) => {
      if (request.url().startsWith('https://cdn.ampproject.org/')) {
        request.respond({
          status: 200,
          body: '',
        });
      } else {
        request.continue();
      }
    });
  });

  afterAll(async () => {
    await page.setRequestInterception(false);
    stopRequestInterception();
  });

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

    // Disable Gutenberg's Welcome Guide if existing.
    const isWelcomeGuideActive = await page.evaluate(() =>
      wp.data.select('core/edit-post').isFeatureActive('welcomeGuide')
    );

    //eslint-disable-next-line jest/no-if
    if (isWelcomeGuideActive) {
      await page.evaluate(() =>
        wp.data.dispatch('core/edit-post').toggleFeature('welcomeGuide')
      );
    }

    await expect(page).toMatch('Publishing Flow Test');

    expect(await getEditedPostContent()).toMatchSnapshot();

    const werePrePublishChecksEnabled = await arePrePublishChecksEnabled();

    //eslint-disable-next-line jest/no-if
    if (werePrePublishChecksEnabled) {
      await disablePrePublishChecks();
    }

    await publishPostWithPrePublishChecksDisabled();
    await enablePrePublishChecks();

    const postPermalink = await page.evaluate(() =>
      wp.data.select('core/editor').getPermalink()
    );

    await Promise.all([page.goto(postPermalink), page.waitForNavigation()]);

    await expect(page).toMatch('Publishing Flow Test');
    await expect(page).toMatchElement('amp-story-player');
  });
});
