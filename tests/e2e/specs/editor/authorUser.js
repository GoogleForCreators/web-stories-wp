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
import { createNewStory, previewStory, addTextElement } from '../../utils';

async function insertStoryTitle(title) {
  await expect(page).toMatchElement('input[placeholder="Add title"]');
  await page.type('input[placeholder="Add title"]', title);
}

async function publishStory() {
  await expect(page).toClick('button', { text: 'Publish' });
  await expect(page).toMatch('Story published!');
  await expect(page).toClick('button', { text: 'Dismiss' });
  await expect(page).toMatchElement('button', {
    text: 'Switch to Draft',
  });
  await expect(page).toClick('button', { text: 'Update' });
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

    await insertStoryTitle('Previewing without Publishing');

    await addTextElement();

    await percySnapshot(page, 'Author previewing without publishing');

    const editorPage = page;
    const previewPage = await previewStory(editorPage);
    await expect(previewPage).toMatchElement('p', {
      text: 'Fill in some text',
    });

    await editorPage.bringToFront();
    await previewPage.close();
  });

  //eslint-disable-next-line jest/no-disabled-tests
  it.skip('should be able to publish a story without markup being stripped', async () => {
    await createNewStory();

    await insertStoryTitle('Publishing and Previewing');

    // Make some changes _before_ publishing the story.
    await addTextElement();

    await publishStory();

    await percySnapshot(page, 'Author previewing after publishing');

    const editorPage = page;
    const previewPage = await previewStory(editorPage);
    await expect(previewPage).toMatchElement('p', {
      text: 'Fill in some text',
    });

    await editorPage.bringToFront();
    await previewPage.close();
  });

  //eslint-disable-next-line jest/no-disabled-tests
  it.skip('should be able to publish and preview a story without markup being stripped', async () => {
    await createNewStory();

    await insertStoryTitle('Autosaving and Previewing');

    await publishStory();

    // Make some changes _after_ publishing so previewing will cause an autosave.
    await addTextElement();

    await percySnapshot(page, 'Autosaving and previewing');

    const editorPage = page;
    const previewPage = await previewStory(editorPage);
    await expect(previewPage).toMatchElement('p', {
      text: 'Fill in some text',
    });

    await editorPage.bringToFront();
    await previewPage.close();
  });
});
