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
  arePrePublishChecksEnabled,
  disablePrePublishChecks,
  publishPostWithPrePublishChecksDisabled,
  enablePrePublishChecks,
  insertBlock,
  setPostContent,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
  addRequestInterception,
  withDisabledToolbarOnFrontend,
} from '../../utils';

const EMBED_BLOCK_CONTENT = `
<!-- wp:web-stories/embed {"url":"https://preview.amp.dev/documentation/examples/introduction/stories_in_amp","title":"Stories in AMP - Hello World","poster":"https://amp.dev/static/samples/img/story_dog2_portrait.jpg"} -->
<div class="wp-block-web-stories-embed alignnone"><amp-story-player style="width:360px;height:600px" data-testid="amp-story-player"><a href="https://preview.amp.dev/documentation/examples/introduction/stories_in_amp" style="--story-player-poster:url('https://amp.dev/static/samples/img/story_dog2_portrait.jpg')">Stories in AMP - Hello World</a></amp-story-player></div>
<!-- /wp:web-stories/embed -->
`;

describe('Embed Block', () => {
  let stopRequestInterception;

  beforeAll(async () => {
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
  });

  it('should insert a new embed block', async () => {
    await createNewPost({
      showWelcomeGuide: false,
    });
    await insertBlock('Web Story');

    await page.keyboard.type(
      'https://preview.amp.dev/documentation/examples/introduction/stories_in_amp'
    );
    await page.keyboard.press('Enter');

    await expect(page).toMatch('Embed Settings');
  });

  describe('AMP validation', () => {
    withDisabledToolbarOnFrontend();

    it('should produce valid AMP when using the AMP plugin', async () => {
      await activatePlugin('amp');

      await createNewPost({
        showWelcomeGuide: false,
      });

      await setPostContent(EMBED_BLOCK_CONTENT);

      const werePrePublishChecksEnabled = await arePrePublishChecksEnabled();

      if (werePrePublishChecksEnabled) {
        await disablePrePublishChecks();
      }

      await publishPostWithPrePublishChecksDisabled();
      await enablePrePublishChecks();

      const postPermalink = await page.evaluate(() =>
        wp.data.select('core/editor').getPermalink()
      );

      const ampPostPermaLink = postPermalink.includes('?')
        ? `${postPermalink}&amp`
        : `${postPermalink}?amp`;

      await Promise.all([
        page.goto(ampPostPermaLink),
        page.waitForNavigation(),
      ]);

      await expect(page).toBeValidAMP();

      await deactivatePlugin('amp');
    });
  });
});
