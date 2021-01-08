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
import {
  activatePlugin,
  deactivatePlugin,
  loginUser,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
  addTextElement,
  createNewStory,
  previewStory,
  insertStoryTitle,
} from '../../../utils';

describe('Site Kit integration with editor', () => {
  beforeAll(async () => {
    await loginUser('admin', 'password');
    await activatePlugin('web-stories-test-plugin-site-kit');
  });

  afterAll(async () => {
    await deactivatePlugin('web-stories-test-plugin-site-kit');
  });

  it('should print an analytics tag', async () => {
    await createNewStory();

    await insertStoryTitle('Previewing Analytics');

    await addTextElement();

    const editorPage = page;
    const previewPage = await previewStory(editorPage);
    await expect(previewPage).toMatchElement('p', {
      text: 'Fill in some text',
    });

    await expect(previewPage).toMatch('XXX-YYY');

    await editorPage.bringToFront();
    await previewPage.close();
  });
});
