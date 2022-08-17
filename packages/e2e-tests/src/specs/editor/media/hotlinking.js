/*
 * Copyright 2022 Google LLC
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
  takeSnapshot,
  withPlugin,
} from '@web-stories-wp/e2e-test-utils';
/**
 * Internal dependencies
 */
import { addAllowedErrorMessage } from '../../../config/bootstrap.js';

const IMAGE_URL_LOCAL = `${process.env.WP_BASE_URL}/wp-content/e2e-assets/example-3.png`;
const IMAGE_URL_CORS_PROXY = 'https://wp.stories.google/e2e-tests/example.jpg';

describe('Media Hotlinking', () => {
  withPlugin('e2e-tests-hotlink');

  let removeCORSErrorMessage;
  let removeResourceErrorMessage;

  beforeAll(() => {
    // Ignore CORS error, this is present in the test by design.
    removeCORSErrorMessage = addAllowedErrorMessage(
      'has been blocked by CORS policy'
    );
    // Ignore resource failing to load. This is only present because of the CORS error.
    removeResourceErrorMessage = addAllowedErrorMessage(
      'Failed to load resource'
    );
  });

  afterAll(() => {
    removeCORSErrorMessage();
    removeResourceErrorMessage();
  });

  // Uses the existence of the element's frame element as an indicator for successful insertion.
  it('should insert a local image', async () => {
    await createNewStory();

    await expect(page).toClick('button[aria-label="Insert by link"]');

    await page.waitForSelector('[role="dialog"]');
    await expect(page).toMatch('Insert external image or video');

    await page.type('input[type="url"]', IMAGE_URL_LOCAL);

    await expect(page).toMatchElement(
      '[role="dialog"] button:not([disabled])',
      {
        text: 'Insert',
      }
    );

    await expect(page).toClick('[role="dialog"] button', {
      text: 'Insert',
    });

    await page.waitForSelector(
      '[aria-label="Design options for selected element"]'
    );

    await expect(page).toMatchElement(`img[src="${IMAGE_URL_LOCAL}"]`);
  });

  it('should insert an external image via proxy', async () => {
    await createNewStory();

    await expect(page).toClick('button[aria-label="Insert by link"]');

    await page.waitForSelector('[role="dialog"]');
    await expect(page).toMatch('Insert external image or video');

    await page.type('input[type="url"]', IMAGE_URL_CORS_PROXY);

    await expect(page).toMatchElement(
      '[role="dialog"] button:not([disabled])',
      {
        text: 'Insert',
      }
    );

    await expect(page).toClick('[role="dialog"] button', {
      text: 'Insert',
    });

    await page.waitForSelector(
      '[aria-label="Design options for selected element"]'
    );

    await expect(page).toMatchElement(
      'img[src*="/web-stories/v1/hotlink/proxy/"]'
    );
    await expect(page).not.toMatchElement(`img[src="${IMAGE_URL_CORS_PROXY}"]`);

    await takeSnapshot(page, 'Media Hotlinking - with CORS');
  });

  describe('Story Poster', () => {
    it('should insert an external poster via proxy', async () => {
      await createNewStory();

      await expect(page).toClick('li[role="tab"]', { text: 'Document' });
      await expect(page).toMatchElement('button[aria-label="Poster image"]');

      await expect(page).toClick('button[aria-label="Poster image"]');
      await expect(page).toClick('[role="menuitem"]', {
        text: 'Link to a file',
      });
      await page.waitForSelector('[role="dialog"]');
      await expect(page).toMatch('Use external image as poster image');

      await page.type('input[type="url"]', IMAGE_URL_LOCAL);

      await expect(page).toMatchElement(
        '[role="dialog"] button:not([disabled])',
        {
          text: 'Use image as poster image',
        }
      );

      await expect(page).toClick('[role="dialog"] button', {
        text: 'Use image as poster image',
      });

      await expect(page).toMatchElement(`img[src="${IMAGE_URL_LOCAL}"]`);
    });
  });
});
