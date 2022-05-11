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
  createNewStory,
  insertStoryTitle,
  withPlugin,
  publishStory,
  getEditedPostContent,
  uploadFile,
  clickButton,
  deleteMedia,
  publishPost,
} from '@web-stories-wp/e2e-test-utils';
/**
 * Internal dependencies
 */
import { addAllowedErrorMessage } from '../../config/bootstrap.js';

describe('Publishing Flow', () => {
  let uploadedFiles;
  let removeCORSErrorMessage;
  let removeResourceErrorMessage;

  beforeEach(() => (uploadedFiles = []));

  afterEach(async () => {
    for (const file of uploadedFiles) {
      // eslint-disable-next-line no-await-in-loop
      await deleteMedia(file);
    }
  });

  beforeAll(() => {
    // Ignore CORS errors related to the AMP validator JS.
    removeCORSErrorMessage = addAllowedErrorMessage(
      'has been blocked by CORS policy'
    );
    removeResourceErrorMessage = addAllowedErrorMessage(
      'Failed to load resource'
    );
  });

  afterAll(() => {
    removeCORSErrorMessage();
    removeResourceErrorMessage();
  });

  async function addPosterImage() {
    await expect(page).toClick('li[role="tab"]', { text: 'Document' });

    await expect(page).toMatchElement('button[aria-label="Poster image"]');

    await expect(page).toClick('button[aria-label="Poster image"]');

    await page.waitForSelector('.media-modal', {
      visible: true,
    });

    await expect(page).toMatch('Select as poster image');

    await expect(page).toClick(
      '.attachments-browser .attachments .attachment[aria-label="example-4"]'
    );

    await clickButton('button.media-button-select');

    await page.waitForSelector('[alt="Preview image"]');
    await expect(page).toMatchElement('[alt="Preview image"]');
  }

  it('should guide me towards creating a new post to embed my story', async () => {
    await createNewStory();

    await insertStoryTitle('Publishing Flow Test');
    await addPosterImage();
    await publishStory(false);

    // Create new post and embed story.
    await Promise.all([
      expect(page).toClick('a', { text: 'Add to new post' }),
      page.waitForNavigation(),
    ]);

    // See https://github.com/WordPress/gutenberg/blob/c31555d4cec541db929ee5f63b900c6577513272/packages/e2e-test-utils/src/create-new-post.js#L37-L63.
    await page.waitForSelector('.edit-post-layout');

    // Disable Gutenberg's Welcome Guide if existing.
    const isWelcomeGuideActive = await page.evaluate(() =>
      wp.data.select('core/edit-post').isFeatureActive('welcomeGuide')
    );

    // eslint-disable-next-line jest/no-conditional-in-test
    if (isWelcomeGuideActive) {
      await page.evaluate(() =>
        wp.data.dispatch('core/edit-post').toggleFeature('welcomeGuide')
      );

      await page.reload();
      await page.waitForSelector('.edit-post-layout');
    }

    // Disable Gutenberg's full screen mode.
    const isFullscreenMode = await page.evaluate(() =>
      wp.data.select('core/edit-post').isFeatureActive('fullscreenMode')
    );

    // eslint-disable-next-line jest/no-conditional-in-test
    if (isFullscreenMode) {
      await page.evaluate(() =>
        wp.data.dispatch('core/edit-post').toggleFeature('fullscreenMode')
      );

      await page.waitForSelector('body:not(.is-fullscreen-mode)');
    }

    await expect(getEditedPostContent()).resolves.toMatch(
      '<!-- wp:web-stories/embed'
    );
    await expect(page).not.toMatch(
      'This block contains unexpected or invalid content.'
    );

    await page.waitForSelector('amp-story-player');

    await expect(page).toMatchElement('amp-story-player');
    await expect(page).toMatch('Publishing Flow Test');

    const postPermalink = await publishPost();

    expect(postPermalink).not.toBeNull();
    expect(postPermalink).toStrictEqual(expect.any(String));

    await page.goto(postPermalink, {
      waitUntil: 'networkidle2',
    });

    await expect(page).toMatchElement('amp-story-player');
    await expect(page).toMatch('Publishing Flow Test');
  });

  describe('Classic Editor', () => {
    withPlugin('classic-editor');

    it('should guide me towards creating a new post to embed my story', async () => {
      await createNewStory();

      await insertStoryTitle('Publishing Flow Test (Shortcode)');
      await addPosterImage();
      await publishStory(false);

      // Create new post and embed story.
      await expect(page).toClick('a', { text: 'Add to new post' });
      await page.waitForNavigation();

      await expect(page).toMatch('Publishing Flow Test');

      // Switch to HTML mode
      await expect(page).toClick('#content-html');

      const textEditorContent = await page.$eval(
        '.wp-editor-area',
        (element) => element.value
      );

      expect(textEditorContent).toMatch('[web_stories_embed');

      await expect(page).toClick('#publish');

      const btnTab = '#message a';
      await page.waitForSelector(btnTab);
      const postPermalink = await page.evaluate((selector) => {
        return document.querySelector(selector).getAttribute('href');
      }, btnTab);

      expect(postPermalink).not.toBeNull();
      expect(postPermalink).toStrictEqual(expect.any(String));

      await page.goto(postPermalink, {
        waitUntil: 'networkidle2',
      });

      await page.waitForSelector('amp-story-player');
      await expect(page).toMatchElement('amp-story-player');
      await expect(page).toMatch('Publishing Flow Test');
    });
  });
});
