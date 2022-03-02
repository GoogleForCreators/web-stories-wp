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
  uploadMedia,
  deleteMedia,
  takeSnapshot,
  withUser,
} from '@web-stories-wp/e2e-test-utils';

describe('Story Details Modal - Contributor User', () => {
  const openStoryDetailsModal = async () => {
    await expect(page).toClick('button', { text: 'Submit for review' });
    await expect(page).toMatchElement('div[aria-label="Story details"]');
  };

  beforeEach(async () => {
    await createNewStory();
    await openStoryDetailsModal();
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

    await expect(page).not.toMatchElement('div[aria-label="Story details"]');
    await expect(page).not.toMatch('Story published.');
    await expect(page).not.toMatchElement('button', { text: 'Dismiss' });
  });

  it('should not be able to update Story visibility', async () => {
    const visibilityDropDownButton = await expect(page).toMatchElement(
      'button',
      { text: 'Public' }
    );
    await expect(visibilityDropDownButton).toMatch('Public');

    await visibilityDropDownButton.click();

    await expect(page).not.toMatchElement(
      '[aria-label=" Option List Selector"]'
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

    // TODO https://github.com/googleforcreators/web-stories-wp/issues/7107
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('should update featured media (poster)', async () => {
      await openPublishingPanel();

      const featuredMediaButton = await expect(page).toMatchElement(
        'div[aria-label="Story details"] button[aria-label="Poster image"]'
      );

      await featuredMediaButton.click();

      const filename = await uploadMedia('example-1.jpg', false);

      await expect(page).toClick('button', { text: 'Select as poster image' });

      await expect(page).toMatchElement(
        '[data-testid="story_preview_featured_media"]'
      );

      await deleteMedia(filename);
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
