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
  takeSnapshot,
  trashAllPosts,
  withPlugin,
  withUser,
} from '@web-stories-wp/e2e-test-utils';

const IMAGE_URL_LOCAL = `${process.env.WP_BASE_URL}/wp-content/e2e-assets/example-3.png`;

const openStoryDetailsModal = async () => {
  await expect(page).toClick('button', { text: 'Submit for review' });
  await expect(page).toMatchElement('div[aria-label="Story details"]');
};

jest.retryTimes(3, { logErrorsBeforeRetry: true });

describe('Story Details Modal - Contributor User', () => {
  withPlugin('e2e-tests-hotlink');

  beforeEach(async () => {
    await createNewStory();
    await openStoryDetailsModal();
  });

  afterAll(async () => {
    await trashAllPosts('web-story');
  });

  withUser('contributor', 'password');

  it('should allow title update', async () => {
    await expect(page).toMatchElement('textarea[placeholder="Add title"]');

    await page.type(
      'textarea[placeholder="Add title"]',
      'Story Details Modal - contributor'
    );
    await page.keyboard.press('Tab');

    // Make sure title is displayed over preview
    await expect(page).toMatchElement('div[aria-label="Story details"] h3', {
      text: 'Story Details Modal - contributor',
    });

    await takeSnapshot(page, 'Story Details Modal - contributor');
  });

  it('should close modal when story submitted for review', async () => {
    await expect(page).toClick('div[aria-label="Story details"] button', {
      text: 'Submit for review',
    });
    await expect(page).toMatchElement('button', { text: 'Dismiss' });
    await expect(page).not.toMatchElement('div[aria-label="Story details"]');
    await expect(page).not.toMatchTextContent('Story published.');
  });

  it('should not be able to update Story visibility', async () => {
    await expect(page).toClick('button', {
      text: 'Public',
    });

    await expect(page).not.toMatchElement(
      '[aria-label="Option List Selector"]'
    );
  });

  describe('Publishing Panel', () => {
    async function openPublishingPanel() {
      //find publish panel button
      const publishPanelButton = await expect(page).toMatchElement(
        'div[aria-label="Story details"] button',
        { text: 'Publishing' }
      );

      const isPublishPanelExpanded = await publishPanelButton.evaluate(
        (node) => node.getAttribute('aria-expanded') === 'true'
      );
      //open publish panel if not open
      if (!isPublishPanelExpanded) {
        await publishPanelButton.click();
      }
    }

    it('should not allow author to change', async () => {
      await openPublishingPanel();

      await expect(page).not.toMatchElement(
        'div[aria-label="Story details"] button[aria-label="Author"]'
      );
    });

    it('should not allow publish date to change', async () => {
      await openPublishingPanel();

      await expect(page).not.toMatchElement(
        'div[aria-label="Story details"] button[aria-label="Story publish time"]'
      );
    });

    it('should update featured media (poster)', async () => {
      await openPublishingPanel();

      await expect(page).toClick(
        'div[aria-label="Story details"] button[aria-label="Poster image"]'
      );

      await expect(page).not.toMatchElement('[role="menuitem"]', {
        text: 'Upload a file',
      });

      await expect(page).toClick('[role="menuitem"]', {
        text: 'Link to a file',
      });

      await page.waitForSelector('[role="dialog"]');
      await expect(page).toMatchTextContent(
        'Use external image as poster image'
      );

      await page.type('input[type="url"]', IMAGE_URL_LOCAL);

      await expect(page).toMatchElement(
        '[role="dialog"] button:not([disabled])',
        {
          text: 'Use image as poster image',
        }
      );

      await Promise.all([
        expect(page).toClick('[role="dialog"] button', {
          text: 'Use image as poster image',
        }),
        await page.waitForResponse(
          (response) =>
            //eslint-disable-next-line jest/no-conditional-in-test -- False positive.
            response.url().includes('web-stories/v1/hotlink/validate') &&
            response.status() === 200
        ),
      ]);

      // Dialog should disappear by now.
      await expect(page).not.toMatchTextContent(
        'Use external image as poster image'
      );

      await expect(page).toMatchElement(
        '[data-testid="story_preview_featured_media"]'
      );
    });
  });

  describe('Permalink Panel', () => {
    async function openPermalinkPanel() {
      //find permalink panel button
      const permalinkPanelButton = await expect(page).toMatchElement(
        'div[aria-label="Story details"] button',
        { text: 'Permalink' }
      );

      const isPermalinkPanelExpanded = await permalinkPanelButton.evaluate(
        (node) => node.getAttribute('aria-expanded') === 'true'
      );
      //open publish panel if not open
      if (!isPermalinkPanelExpanded) {
        await permalinkPanelButton.click();
      }
    }

    it('should create a permalink based on story title', async () => {
      openPermalinkPanel();
      await expect(page).toMatchElement('textarea[placeholder="Add title"]');

      await page.type(
        'textarea[placeholder="Add title"]',
        'Story Details Modal - contributor'
      );

      await page.keyboard.press('Tab');

      await expect(page).toMatchElement(
        'input[aria-label="URL slug"][value="story-details-modal-contributor"]'
      );
    });
  });
});
