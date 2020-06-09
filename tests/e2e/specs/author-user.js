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
import { loginUser, switchUserToAdmin } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { createNewStory } from '../utils';

async function openPreviewPage(editorPage) {
  let openTabs = await browser.pages();
  const expectedTabsCount = openTabs.length + 1;
  await expect(editorPage).toClick('button', { text: 'Preview' });

  // Wait for the new tab to open.
  while (openTabs.length < expectedTabsCount) {
    /* eslint-disable no-await-in-loop */
    await editorPage.waitFor(1);
    openTabs = await browser.pages();
    /* eslint-enable no-await-in-loop */
  }

  const previewPage = openTabs[openTabs.length - 1];
  await previewPage.waitForSelector('amp-story');
  return previewPage;
}

describe('Author User', () => {
  beforeAll(async () => {
    await loginUser('author', 'password');
  });

  afterAll(async () => {
    await switchUserToAdmin();
  });

  it('should be able to directly preview a story without markup being stripped', async () => {
    await createNewStory();

    await expect(page).toMatchElement('input[placeholder="Add title"]');
    await page.type(
      'input[placeholder="Add title"]',
      'Previewing without Publishing'
    );

    await expect(page).toClick('button[aria-label="Add new text element"]');
    await expect(page).toMatch('Fill in some text');

    const editorPage = page;
    const previewPage = await openPreviewPage(editorPage);
    await expect(previewPage).toMatch('Fill in some text');
    await previewPage.close();
    await editorPage.bringToFront();
  });

  it('should be able to publish a story without markup being stripped', async () => {
    await createNewStory();

    await expect(page).toMatchElement('input[placeholder="Add title"]');
    await page.type(
      'input[placeholder="Add title"]',
      'Publishing and Previewing'
    );

    // Make some changes before publishing the story.
    await expect(page).toClick('button[aria-label="Add new text element"]');
    await expect(page).toMatch('Fill in some text');

    // Publish story.
    await expect(page).toClick('button', { text: 'Publish' });
    await expect(page).toMatchElement('button', { text: 'Update' });

    const editorPage = page;
    const previewPage = await openPreviewPage(editorPage);
    await expect(previewPage).toMatch('Fill in some text');
    await previewPage.close();
    await editorPage.bringToFront();
  });

  it('should be able to publish and preview a story without markup being stripped', async () => {
    await createNewStory();

    await expect(page).toMatchElement('input[placeholder="Add title"]');
    await page.type(
      'input[placeholder="Add title"]',
      'Autosaving and Previewing'
    );

    // Publish story.
    await expect(page).toClick('button', { text: 'Publish' });
    await expect(page).toMatchElement('button', { text: 'Update' });

    // Make some changes after publishing so previewing will cause an autosave.
    await expect(page).toClick('button[aria-label="Add new text element"]');
    await expect(page).toMatch('Fill in some text');

    const editorPage = page;
    const previewPage = await openPreviewPage(editorPage);
    await expect(previewPage).toMatch('Fill in some text');
    await previewPage.close();
    await editorPage.bringToFront();
  });
});
