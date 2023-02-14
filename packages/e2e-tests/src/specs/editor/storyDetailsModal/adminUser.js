/*
 * Copyright 2021 Google LLC
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
  deleteMedia,
  takeSnapshot,
  uploadFile,
} from '@web-stories-wp/e2e-test-utils';

/**
 * Internal dependencies
 */
import { addAllowedErrorMessage } from '../../../config/bootstrap';

const openStoryDetailsModal = async () => {
  await expect(page).toClick('button', { text: 'Publish' });
  await expect(page).toMatchElement('div[aria-label="Story details"]');
};

jest.retryTimes(3, { logErrorsBeforeRetry: true });

describe('Story Details Modal - Admin User', () => {
  let removeErrorMessage;
  let uploadedFiles;

  beforeAll(() => {
    // TODO: Address 404 caused by AMP validation being called for protected post.
    removeErrorMessage = addAllowedErrorMessage(
      'the server responded with a status of 404'
    );
  });

  beforeEach(async () => {
    uploadedFiles = [];

    await createNewStory();
    await openStoryDetailsModal();
  });

  afterEach(async () => {
    for (const file of uploadedFiles) {
      // eslint-disable-next-line no-await-in-loop
      await deleteMedia(file);
    }
  });

  afterAll(() => {
    removeErrorMessage();
  });

  describe('Main Details', () => {
    it('should allow title update', async () => {
      await expect(page).toMatchElement('textarea[placeholder="Add title"]');

      await page.type(
        'textarea[placeholder="Add title"]',
        'Story Details Modal - admin'
      );
      await page.keyboard.press('Tab');

      // Make sure title is displayed over preview
      await expect(page).toMatchElement('div[aria-label="Story details"] h3', {
        text: 'Story Details Modal - admin',
      });

      await takeSnapshot(page, 'Story Details Modal - Admin');
    });

    it('should have 3 visibility options', async () => {
      await expect(page).toClick('button', { text: 'Public' });

      await expect(page).toClick('[aria-label=" Option List Selector"] li', {
        text: 'Password Protected',
      });

      await expect(page).toMatchElement('p', {
        text: 'Visible only to those with the password.',
      });
    });
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

    it('should allow changing author', async () => {
      await openPublishingPanel();

      const authorDropDownButton = await expect(page).toMatchElement(
        'div[aria-label="Story details"] button[aria-label="Author"]'
      );
      await expect(authorDropDownButton).toMatch('admin');

      await authorDropDownButton.click();

      const authorDropDownOptions = await expect(page).toMatchElement(
        '[aria-label="Option List Selector"]'
      );

      await expect(authorDropDownOptions).toClick('li', { text: 'author' });

      await expect(authorDropDownButton).toMatch('author');
    });

    it('should allow searching author', async () => {
      await openPublishingPanel();

      const authorDropDownButton = await expect(page).toMatchElement(
        'div[aria-label="Story details"] button[aria-label="Author"]'
      );
      await expect(authorDropDownButton).toMatch('admin');

      await authorDropDownButton.click();

      await expect(page).toMatchElement('[aria-label="Option List Selector"]');

      const optionListBeforeSearch = await page.$$eval(
        '[aria-label="Option List Selector"] li[role="option"]',
        (nodeList) => nodeList.map((node) => node.innerText)
      );
      expect(optionListBeforeSearch).toBeDefined();
      expect(optionListBeforeSearch.length).toBeGreaterThan(1);

      await page.keyboard.type('auth');

      // wait for search results
      await page.waitForResponse(
        (response) =>
          //eslint-disable-next-line jest/no-conditional-in-test
          response.url().includes('web-stories/v1/users') &&
          response.url().includes('search=auth') &&
          response.status() === 200
      );

      // add small delay after we have results
      await page.waitForTimeout(400);

      const optionListAfterSearch = await page.$$eval(
        '[aria-label="Option List Selector"] li[role="option"]',
        (nodeList) => nodeList.map((node) => node.innerText)
      );

      expect(optionListAfterSearch).toHaveLength(1);

      await expect(page).toClick('[aria-label="Option List Selector"] li', {
        text: 'author',
      });
      await expect(authorDropDownButton).toMatch('author');
    });

    it('should allow publish date to change', async () => {
      await openPublishingPanel();

      await expect(page).toClick(
        'div[aria-label="Story details"] button[aria-label="Story publish time"]',
        { text: 'Immediately' }
      );

      // date picker is in a new popup so use keyboard to avoid more targets.
      // We want to tab from hour, am/pm, month back, to currently selected "immediate" date
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      // From the currently selected date, arrow right to get a future date
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      // Select future date with keyboard
      await page.keyboard.press('Enter');

      // check that publish button says 'schedule'
      await expect(page).toMatchElement(
        'div[aria-label="Story details"] button',
        { name: 'Schedule' }
      );
    });

    it('should update featured media (poster)', async () => {
      await openPublishingPanel();

      await expect(page).toClick(
        'div[aria-label="Story details"] button[aria-label="Poster image"]'
      );

      await expect(page).toClick('[role="menuitem"]', {
        text: 'Upload a file',
      });

      await page.waitForSelector('.media-modal', {
        visible: true,
      });

      await expect(page).toClick('.media-modal #menu-item-upload', {
        text: 'Upload files',
        visible: true,
      });

      const fileName = await uploadFile('example-1.jpg', false);
      uploadedFiles.push(fileName);

      await expect(page).toClick('button', {
        text: 'Select as poster image',
        visible: true,
      });

      await expect(page).toClick('button', {
        text: 'Crop image',
        visible: true,
      });

      await page.keyboard.press('Escape');

      await page.waitForSelector('.media-modal', {
        visible: false,
      });

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
        'Story Details Modal - admin'
      );

      await page.keyboard.press('Tab');

      await expect(page).toMatchElement(
        'input[aria-label="URL slug"][value="story-details-modal-admin"]'
      );
    });
  });
});
