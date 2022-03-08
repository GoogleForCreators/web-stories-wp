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
  publishPost,
  insertStoryTitle,
  withPlugin,
  publishStory,
  getEditedPostContent,
} from '@web-stories-wp/e2e-test-utils';

// Disable for https://github.com/googleforcreators/web-stories-wp/issues/6238
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('Publishing Flow', () => {
  it('should guide me towards creating a new post to embed my story', async () => {
    await createNewStory();

    await insertStoryTitle('Publishing Flow Test');

    await publishStory(false);

    // Create new post and embed story.
    await expect(page).toClick('a', { text: 'Add to new post' });
    await page.waitForNavigation();

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

    await page.waitForSelector('amp-story-player');
    await expect(page).toMatchElement('amp-story-player');
    await expect(page).toMatch('Publishing Flow Test');

    await expect(getEditedPostContent()).resolves.toMatchSnapshot();

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

      expect(textEditorContent).toMatchSnapshot();

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
