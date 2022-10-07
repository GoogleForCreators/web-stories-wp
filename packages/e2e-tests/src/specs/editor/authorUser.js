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
  publishStory,
} from '@web-stories-wp/e2e-test-utils';

jest.retryTimes(2, { logErrorsBeforeRetry: true });

describe('Author User', () => {
  withUser('author', 'password');

  it('should directly preview a story without markup being stripped', async () => {
    await createNewStory();

    await insertStoryTitle('Previewing without Publishing');

    await addTextElement();

    const previewPage = await previewStory();
    await expect(previewPage).toMatchElement('p', {
      text: 'Fill in some text',
    });

    await page.bringToFront();
    await previewPage.close();
  });

  it('should publish a story without markup being stripped', async () => {
    await createNewStory();

    await insertStoryTitle('Publishing and Previewing');

    // Make some changes _before_ publishing the story.
    await addTextElement();

    await publishStory();

    const previewPage = await previewStory();
    await expect(previewPage).toMatchElement('p', {
      text: 'Fill in some text',
    });

    await previewPage.close();
    await page.bringToFront();
  });

  it('should publish and preview a story without markup being stripped', async () => {
    await createNewStory();

    await insertStoryTitle('Autosaving and Previewing');

    await publishStory();

    // Make some changes _after_ publishing so previewing will cause an autosave.
    await addTextElement();

    const previewPage = await previewStory();
    await expect(previewPage).toMatchElement('p', {
      text: 'Fill in some text',
    });

    await page.bringToFront();
    await previewPage.close();
  });
});
