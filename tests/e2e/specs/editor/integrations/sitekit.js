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
import { activatePlugin, deactivatePlugin } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
  addTextElement,
  createNewStory,
  previewStory,
  insertStoryTitle,
} from '../../../utils';

describe('Sitekit integration with editor', () => {
  beforeAll(async () => {
    await activatePlugin('google-site-kit');
    await activatePlugin('e2e-tests-sitekit-mock');
  });

  afterAll(async () => {
    await deactivatePlugin('google-site-kit');
    await deactivatePlugin('e2e-tests-sitekit-mock');
  });

  it('should be see analytics tag', async () => {
    await createNewStory();

    await insertStoryTitle('Previewing Analytics');

    await addTextElement();

    const editorPage = page;
    const previewPage = await previewStory(editorPage);
    await expect(previewPage).toMatchElement('.i-amphtml-layout-fixed');

    await editorPage.bringToFront();
    await previewPage.close();
  });
});
