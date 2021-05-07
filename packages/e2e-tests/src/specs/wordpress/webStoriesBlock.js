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
  activatePlugin,
  deactivatePlugin,
  createNewPost,
  setPostContent,
} from '@wordpress/e2e-test-utils';

/**
 * External dependencies
 */
import {
  addRequestInterception,
  publishPost,
  withDisabledToolbarOnFrontend,
  insertBlock,
} from '@web-stories-wp/e2e-test-utils';

/**
 * Internal dependencies
 */
import { addAllowedErrorMessage } from '../../config/bootstrap';

const EMBED_BLOCK_CONTENT = `
<!-- wp:web-stories/embed {"url":"https://preview.amp.dev/documentation/examples/introduction/stories_in_amp","title":"Stories in AMP - Hello World","poster":"https://amp.dev/static/samples/img/story_dog2_portrait.jpg"} -->
<div class="wp-block-web-stories-embed alignnone"><amp-story-player style="width:360px;height:600px" data-testid="amp-story-player"><a href="https://preview.amp.dev/documentation/examples/introduction/stories_in_amp" style="--story-player-poster:url('https://amp.dev/static/samples/img/story_dog2_portrait.jpg')">Stories in AMP - Hello World</a></amp-story-player></div>
<!-- /wp:web-stories/embed -->
`;

describe('Web Stories Block', () => {
  let stopRequestInterception;
  let removeErrorMessage;

  beforeAll(async () => {
    removeErrorMessage = addAllowedErrorMessage(
      'Failed to load resource: the server responded with a status of 404'
    );
    await page.setRequestInterception(true);
    stopRequestInterception = addRequestInterception((request) => {
      // amp-story-player scripts
      if (request.url().startsWith('https://cdn.ampproject.org/')) {
        request.respond({
          status: 200,
          body: '',
        });
        return;
      }

      // Fetching metadata for the story.
      if (request.url().includes('web-stories/v1/embed')) {
        request.respond({
          status: 200,
          body:
            '{"title":"Stories in AMP - Hello World","poster":"https:\\/\\/amp.dev\\/static\\/samples\\/img\\/story_dog2_portrait.jpg"}',
        });
        return;
      }

      request.continue();
    });
  });

  afterAll(async () => {
    await page.setRequestInterception(false);
    stopRequestInterception();
    removeErrorMessage();
  });

  it('should insert a new web stories block', async () => {
    await createNewPost({
      showWelcomeGuide: false,
    });
    await insertBlock('Web Stories');

    await page.waitForSelector('[data-testid="ws-block-configuration-panel"]');
    await expect(page).toClick('div.components-card__body', {
      text: 'Story URL',
    });

    await page.type(
      'input[aria-label="Story URL"]',
      'https://preview.amp.dev/documentation/examples/introduction/stories_in_amp'
    );
    await expect(page).toClick('button', { text: 'Embed' });

    await expect(page).not.toMatch(
      'Sorry, this content could not be embedded.'
    );

    // Wait a little longer for embed REST API request to come back.
    await page.waitForSelector('amp-story-player');
    await expect(page).toMatchElement('amp-story-player');
    await expect(page).toMatch('Embed Settings');
  });
  // Disable for https://github.com/google/web-stories-wp/issues/6237
  // eslint-disable-next-line jest/no-disabled-tests
  describe.skip('AMP validation', () => {
    withDisabledToolbarOnFrontend();

    it('should produce valid AMP when using the AMP plugin', async () => {
      await activatePlugin('amp');

      await createNewPost({
        showWelcomeGuide: false,
      });

      await setPostContent(EMBED_BLOCK_CONTENT);

      const postPermalink = await publishPost();

      expect(postPermalink).not.toBeNull();
      expect(postPermalink).toStrictEqual(expect.any(String));

      const ampPostPermaLink = postPermalink.includes('?')
        ? `${postPermalink}&amp`
        : `${postPermalink}?amp`;

      await page.goto(ampPostPermaLink, {
        waitUntil: 'networkidle0',
      });

      await page.waitForSelector('amp-story-player');
      await expect(page).toMatchElement('amp-story-player');

      await expect(page).toBeValidAMP();

      await deactivatePlugin('amp');
    });
  });
});
