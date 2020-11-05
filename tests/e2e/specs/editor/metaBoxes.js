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

import { percySnapshot } from '@percy/puppeteer';

/**
 * WordPress dependencies
 */
import { activatePlugin, deactivatePlugin } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
  createNewStory,
  withExperimentalFeatures,
  previewStory,
} from '../../utils';

describe('Custom Meta Boxes', () => {
  withExperimentalFeatures(['customMetaBoxes']);

  beforeAll(async () => {
    await activatePlugin('web-stories-test-plugin-meta-box');
  });

  afterAll(async () => {
    await deactivatePlugin('web-stories-test-plugin-meta-box');
  });

  it('should display meta boxes and save their content', async () => {
    await createNewStory();

    await expect(page).toMatchElement('input[placeholder="Add title"]');
    await page.type('input[placeholder="Add title"]', 'Meta Box Test');

    await expect(page).toMatchElement('#web_stories_test_meta_box_field');
    await page.type('#web_stories_test_meta_box_field', 'Meta Box Test Value');

    await percySnapshot(page, 'Custom Meta Box Support');

    // Publish story.
    await expect(page).toClick('button', { text: 'Publish' });

    await expect(page).toMatchElement('button', { text: 'Dismiss' });

    const editorPage = page;
    const previewPage = await previewStory(editorPage);

    // This will confirm that the data was saved successfully.
    await expect(previewPage).toMatchElement(
      'meta[property="web-stories:meta-box-test"][content="Meta Box Test Value"]'
    );

    await editorPage.bringToFront();
    await previewPage.close();
  });
});
