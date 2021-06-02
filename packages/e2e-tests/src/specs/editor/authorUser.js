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
  previewStory,
  addTextElement,
  insertStoryTitle,
  withUser,
} from '@web-stories-wp/e2e-test-utils';
import percySnapshot from '@percy/puppeteer';

async function publishStory() {
  await expect(page).toClick('button', { text: 'Publish' });
  // Bypass checklist
  await page.waitForSelector('.ReactModal__Content');
  await expect(page).toClick('button', {
    text: /Continue to publish/,
  });
  await expect(page).toMatch('Story published.');
  await expect(page).toClick('button', { text: 'Dismiss' });
  await expect(page).toMatchElement('button', {
    text: 'Switch to Draft',
  });
  await expect(page).toClick('button', { text: 'Update' });
}

describe('Author User', () => {
  withUser('author', 'password');

  it('should be able to directly preview a story without markup being stripped', async () => {
    await createNewStory();
    await percySnapshot(page, 'Stripped markup');

    await insertStoryTitle('Previewing without Publishing');

    await addTextElement();

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

    const editorPage = page;
    const previewPage = await previewStory(editorPage);
    await expect(previewPage).toMatchElement('p', {
      text: 'Fill in some text',
    });

    await editorPage.bringToFront();
    await previewPage.close();
  });
});
