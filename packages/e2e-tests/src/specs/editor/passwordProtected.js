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
  addTextElement,
  createNewStory,
  insertStoryTitle,
  previewStory,
} from '@web-stories-wp/e2e-test-utils';

/**
 * Internal dependencies
 */
import { addAllowedErrorMessage } from '../../config/bootstrap';

jest.retryTimes(3, { logErrorsBeforeRetry: true });

describe('Password protected stories', () => {
  let removeErrorMessage;

  beforeAll(() => {
    // TODO: Address 404 caused by AMP validation being called for protected post.
    removeErrorMessage = addAllowedErrorMessage(
      'the server responded with a status of 404'
    );
  });

  afterAll(() => {
    removeErrorMessage();
  });

  it('should display password form on frontend', async () => {
    await createNewStory();

    await insertStoryTitle('Password protected story');

    await addTextElement();

    await expect(page).toClick('li[role="tab"]', { text: 'Document' });
    await expect(page).toClick('button', { text: 'Public' });
    await expect(page).toClick('li[role="option"]', {
      text: /^Password Protected/,
    });

    await expect(page).toMatchElement('input[placeholder="Enter a password"]');
    await page.type('input[placeholder="Enter a password"]', 'password');

    const editorPage = page;
    const previewPage = await previewStory(false);

    await expect(previewPage).toMatchTextContent(
      'Protected: Password protected story'
    );

    await expect(previewPage).not.toMatchTextContent('Page not found');

    await previewPage.waitForSelector('input[name="post_password"]');
    await previewPage.focus('input[name="post_password"]');

    await expect(previewPage).toMatchTextContent(
      'This content is password protected'
    );

    await expect(previewPage).toFill('input[name="post_password"]', 'password');

    // Submitting the form will cause the page to be reloaded.
    await Promise.all([
      previewPage.waitForNavigation(),
      previewPage.keyboard.press('Enter'),
    ]);

    await editorPage.bringToFront();
    await previewPage.close();
  });
});
