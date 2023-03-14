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
  loadPostEditor,
  publishPost,
  trashAllPosts,
} from '@web-stories-wp/e2e-test-utils';

/**
 * Internal dependencies
 */
import { addAllowedErrorMessage } from '../../config/bootstrap';

async function addPosterImage() {
  await expect(page).toClick('li[role="tab"]', { text: 'Document' });

  await expect(page).toClick('button[aria-label="Poster image"]');
  await expect(page).toClick('[role="menuitem"]', { text: 'Upload a file' });

  await page.waitForSelector('.media-modal', {
    visible: true,
  });

  await expect(page).toMatchElement('.media-toolbar-primary button', {
    text: 'Select as poster image',
  });

  await expect(page).toClick('button', { text: 'Media Library' });

  await expect(page).toClick(
    '.attachments-browser .attachments .attachment[aria-label="example-3"]'
  );

  await expect(page).toClick('.media-toolbar-primary button', {
    text: 'Select as poster image',
  });

  await page.waitForSelector('[alt="Preview image"]');
  await expect(page).toMatchElement('[alt="Preview image"]');
}

jest.retryTimes(3, { logErrorsBeforeRetry: true });

function getEditedPostContent() {
  return page.evaluate(() =>
    wp.data.select('core/editor').getEditedPostContent()
  );
}

describe('Publishing Flow', () => {
  let removeCORSErrorMessage;
  let removeResourceErrorMessage;
  let removeAMPPreloadErrorMessage;

  beforeAll(() => {
    // Ignore CORS errors related to the AMP validator JS.
    removeCORSErrorMessage = addAllowedErrorMessage(
      'has been blocked by CORS policy'
    );
    removeResourceErrorMessage = addAllowedErrorMessage(
      'Failed to load resource'
    );
    // From the story embedded in amp-story-player
    removeAMPPreloadErrorMessage = addAllowedErrorMessage(
      'The resource https://cdn.ampproject.org/v0/amp-story-1.0.js was preloaded using link preload'
    );
  });

  afterAll(async () => {
    removeCORSErrorMessage();
    removeResourceErrorMessage();
    removeAMPPreloadErrorMessage();

    await trashAllPosts();
    await trashAllPosts('web-story');
  });

  it('should guide me towards creating a new post to embed my story with poster', async () => {
    await createNewStory();

    await insertStoryTitle('Publishing Flow Test');
    await addPosterImage();
    await publishStory(false);

    // Create new post and embed story.
    await Promise.all([
      expect(page).toClick('a', { text: 'Add to new post' }),
      page.waitForNavigation(),
    ]);

    await loadPostEditor();

    await expect(getEditedPostContent()).resolves.toMatch(
      '<!-- wp:web-stories/embed'
    );
    await expect(page).not.toMatchTextContent(
      'This block contains unexpected or invalid content.'
    );

    await page.waitForFunction(
      () => !document.querySelector('.wp-block-web-stories-embed.is-loading')
    );

    await page.waitForSelector('amp-story-player');

    await expect(page).toMatchElement('amp-story-player');
    await expect(page).toMatchTextContent('Publishing Flow Test');

    const postPermalink = await publishPost();

    expect(postPermalink).not.toBeNull();
    expect(postPermalink).toStrictEqual(expect.any(String));

    await page.goto(postPermalink, {
      waitUntil: 'networkidle2',
    });

    await expect(page).toMatchElement('amp-story-player');
    await expect(page).toMatchTextContent('Publishing Flow Test');
  });

  it('should guide me towards creating a new post to embed my story without poster', async () => {
    await createNewStory();

    await insertStoryTitle('Publishing Flow Test');
    await publishStory(false);

    // Create new post and embed story.
    await Promise.all([
      expect(page).toClick('a', { text: 'Add to new post' }),
      page.waitForNavigation(),
    ]);

    await loadPostEditor();

    await expect(getEditedPostContent()).resolves.toMatch(
      '<!-- wp:web-stories/embed'
    );
    await expect(page).not.toMatchTextContent(
      'This block contains unexpected or invalid content.'
    );
  });

  describe('Classic Editor', () => {
    withPlugin('classic-editor');

    it('should guide me towards creating a new post to embed my story', async () => {
      await createNewStory();

      await insertStoryTitle('Publishing Flow Test (Shortcode)');
      await addPosterImage();
      await publishStory(false);

      // Create new post and embed story.
      await Promise.all([
        expect(page).toClick('a', { text: 'Add to new post' }),
        page.waitForNavigation(),
      ]);

      await expect(page).toMatchTextContent('Publishing Flow Test');

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
      await expect(page).toMatchTextContent('Publishing Flow Test');
    });
  });
});
