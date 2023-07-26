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
  publishPost,
  withDisabledToolbarOnFrontend,
  insertBlock,
  withPlugin,
  createNewPost,
  setPostContent,
  takeSnapshot,
  trashAllPosts,
} from '@web-stories-wp/e2e-test-utils';

/**
 * Internal dependencies
 */
import { addAllowedErrorMessage } from '../../config/bootstrap';

const EMBED_BLOCK_CONTENT = `
<!-- wp:web-stories/embed {"url":"https://wp.stories.google/stories/intro-to-web-stories-storytime","title":"Stories in AMP - Hello World","poster":"https://amp.dev/static/samples/img/story_dog2_portrait.jpg"} -->
<div class="wp-block-web-stories-embed alignnone"><amp-story-player style="width:360px;height:600px" data-testid="amp-story-player"><a href="https://wp.stories.google/stories/intro-to-web-stories-storytime" style="--story-player-poster:url('https://amp.dev/static/samples/img/story_dog2_portrait.jpg')">Stories in AMP - Hello World</a></amp-story-player></div>
<!-- /wp:web-stories/embed -->
`;

jest.retryTimes(3, { logErrorsBeforeRetry: true });

describe('Web Stories Block', () => {
  withPlugin('e2e-tests-embed');

  let removeErrorMessage;

  beforeAll(() => {
    removeErrorMessage = addAllowedErrorMessage(
      'Failed to load resource: the server responded with a status of 404'
    );
  });

  afterAll(async () => {
    removeErrorMessage();

    await trashAllPosts();
  });

  it('should insert a new web stories block', async () => {
    await createNewPost({
      showWelcomeGuide: false,
    });
    await insertBlock();

    await page.waitForSelector('.web-stories-block-configuration-panel');

    await expect(page).toClick('button', { text: 'Single Story' });

    await expect(page).toMatchTextContent(
      'Select an existing story from your site, or add one with a URL.'
    );
    await expect(page).toClick('button', { text: 'Insert from URL' });

    await page.type(
      'input[aria-label="Story URL"]',
      'https://wp.stories.google/stories/intro-to-web-stories-storytime/'
    );
    await expect(page).toClick('button[aria-label="Embed"]');

    await expect(page).not.toMatchTextContent(
      'Sorry, this content could not be embedded.'
    );

    // Wait a little longer for embed REST API request to come back.
    await page.waitForSelector('amp-story-player');
    await expect(page).toMatchElement('amp-story-player');
    await expect(page).toMatchTextContent('Embed Settings');
  });

  it('should insert a new web stories block and select story', async () => {
    await createNewPost({
      showWelcomeGuide: false,
    });
    await insertBlock();

    await page.waitForSelector('.web-stories-block-configuration-panel');

    await expect(page).toClick('button', { text: 'Selected Stories' });

    await expect(page).toClick('button', { text: 'Box Carousel' });

    await expect(page).toClick('button', { text: 'Select Stories' });

    await page.waitForSelector('.components-modal__screen-overlay');
    await expect(page).toMatchElement('.components-modal__screen-overlay');

    await page.waitForFunction(
      () => !document.querySelector('.components-spinner')
    );

    await takeSnapshot(page, 'Story select modal');
  });

  describe('AMP validation', () => {
    withDisabledToolbarOnFrontend();
    withPlugin('amp');

    let removeMessage1;
    let removeMessage2;

    beforeAll(() => {
      // Some CORS errors when trying to load scripts from AMP CDN.
      removeMessage1 = addAllowedErrorMessage(
        'has been blocked by CORS policy'
      );
      removeMessage2 = addAllowedErrorMessage('Failed to load resource');
    });

    afterAll(() => {
      removeMessage1();
      removeMessage2();
    });

    // The AMP validator currently emits warning about the "data-ampdevmode"
    // attribute, which is added by the AMP plugin.
    // Perhaps because the toolbar is not properly disabled on the frontend?
    // eslint-disable-next-line jest/no-disabled-tests -- TODO: Revisit later.
    it.skip('should produce valid AMP when using the AMP plugin', async () => {
      await createNewPost({
        showWelcomeGuide: false,
      });

      await setPostContent(EMBED_BLOCK_CONTENT);

      const postPermalink = await publishPost();

      expect(postPermalink).not.toBeNull();
      expect(postPermalink).toStrictEqual(expect.any(String));

      //eslint-disable-next-line jest/no-conditional-in-test
      const ampPostPermaLink = postPermalink.includes('?')
        ? `${postPermalink}&amp`
        : `${postPermalink}?amp`;

      await expect(ampPostPermaLink).toBeValidAMP();
    });
  });
});
