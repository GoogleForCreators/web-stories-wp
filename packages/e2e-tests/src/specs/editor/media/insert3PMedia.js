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
  withPlugin,
  clearLocalStorage,
} from '@web-stories-wp/e2e-test-utils';

/**
 * Internal dependencies
 */
import { addAllowedErrorMessage } from '../../../config/bootstrap';

const media3pSelector = '#library-tab-media3p';

jest.retryTimes(2, { logErrorsBeforeRetry: true });

async function goToMedia3PTab() {
  await expect(page).toClick(
    '[aria-label="Element Library Selection"] [role="tab"]',
    { text: 'Explore Media' }
  );

  await expect(page).toMatch(
    'Your use of stock content is subject to third party terms'
  );

  await expect(page).toClick('button', { text: 'Dismiss' });

  await expect(page).not.toMatch(
    'Your use of stock content is subject to third party terms'
  );
}

describe('Inserting 3P Media', () => {
  let removeErrorMessage;

  beforeAll(() => {
    // Coverr videos served from stream.mux.com don't have any CORS headers.
    removeErrorMessage = addAllowedErrorMessage(
      'NotSameOriginAfterDefaultedToSameOriginByCoep'
    );
  });

  beforeEach(async () => {
    await clearLocalStorage();
  });

  afterAll(() => {
    removeErrorMessage();
  });

  it('should insert an Unsplash image', async () => {
    await createNewStory();
    await goToMedia3PTab();

    await expect(page).toMatchElement('button', { text: 'Image' });
    await expect(page).toClick('button', { text: 'Image' });

    await page.waitForSelector(
      '#library-pane-media3p [data-testid="mediaElement-image"]'
    );
    // Clicking will only act on the first element.
    await expect(page).toClick(
      '#library-pane-media3p [data-testid="mediaElement-image"]'
    );
    const insertButton = await page.waitForSelector(
      `xpath/.//li//span[contains(text(), 'Insert image')]`
    );
    await insertButton.click();

    await page.waitForSelector('[data-testid="imageElement"]');
    await expect(page).toMatchElement('[data-testid="imageElement"]');
  });

  it('should insert a Coverr video', async () => {
    await createNewStory();
    await goToMedia3PTab();

    await expect(page).toClick('[role="tablist"] [role="tab"] ', {
      text: 'Video',
    });

    await page.waitForSelector(
      '#library-pane-media3p [data-testid="mediaElement-video"]'
    );

    // This will click in the center of the element, opening the "+" insertion menu.
    await expect(page).toClick(
      '#library-pane-media3p [data-testid="mediaElement-video"]'
    );
    await expect(page).toClick('[role="menu"] [role="menuitem"]', {
      text: 'Insert video',
    });

    await page.waitForSelector('[data-testid="videoElement"]');
    await expect(page).toMatchElement('[data-testid="videoElement"]');
  });

  it('should insert a Tenor GIF', async () => {
    await createNewStory();
    await goToMedia3PTab();

    await expect(page).toClick('[role="tablist"] [role="tab"] ', {
      text: 'GIFs',
    });

    await page.waitForSelector(
      '#library-pane-media3p [data-testid="mediaElement-gif"]'
    );

    // This will click in the center of the element, opening the "+" insertion menu.
    await expect(page).toClick(
      '#library-pane-media3p [data-testid="mediaElement-gif"]'
    );
    await expect(page).toClick('[role="menu"] [role="menuitem"]', {
      text: 'Insert image',
    });

    await page.waitForSelector('[data-testid="videoElement"]');
    await expect(page).toMatchElement('[data-testid="videoElement"]');
  });

  it('should insert a Tenor sticker', async () => {
    await createNewStory();
    await goToMedia3PTab();

    await expect(page).toClick('[role="tablist"] [role="tab"] ', {
      text: 'Stickers',
    });

    await page.waitForSelector(
      '#library-pane-media3p [data-testid="mediaElement-image"]'
    );

    // This will click in the center of the element, opening the "+" insertion menu.
    await expect(page).toClick(
      '#library-pane-media3p [data-testid="mediaElement-image"]'
    );
    await expect(page).toClick('[role="menu"] [role="menuitem"]', {
      text: 'Insert image',
    });

    await page.waitForSelector('[data-testid="imageElement"]');
    await expect(page).toMatchElement('[data-testid="imageElement"]');
  });

  describe('Disabled', () => {
    withPlugin('e2e-tests-disable-3p-media');

    it('should not render 3p media tab', async () => {
      await createNewStory();

      await expect(page).not.toMatchElement(media3pSelector);
    });
  });
});
