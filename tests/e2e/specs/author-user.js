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
import { percySnapshot } from '@percy/puppeteer';

/**
 * WordPress dependencies
 */
import { loginUser, switchUserToAdmin } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { createNewStory, previewStory } from '../utils';

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
    const previewPage = await previewStory(editorPage);

    await expect(previewPage).toMatch('Fill in some text');

    await percySnapshot(
      previewPage,
      'E2E: Author previewing without publishing'
    );

    await editorPage.bringToFront();
    await previewPage.close();
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
    const previewPage = await previewStory(editorPage);

    await expect(previewPage).toMatch('Fill in some text');

    await percySnapshot(previewPage, 'E2E: Author previewing after publishing');

    await editorPage.bringToFront();
    await previewPage.close();
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
    const previewPage = await previewStory(editorPage);

    await expect(previewPage).toMatch('Fill in some text');

    await percySnapshot(previewPage, 'E2E: Autosaving and previewing');

    await editorPage.bringToFront();
    await previewPage.close();
  });
});
