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
 * WordPress dependencies
 */
import {
  activatePlugin,
  deactivatePlugin,
  visitAdminPage,
} from '@wordpress/e2e-test-utils';

/**
 * External dependencies
 */
import percySnapshot from '@percy/puppeteer';

describe('TinyMCE button', () => {
  beforeAll(async () => {
    await activatePlugin('classic-editor');
  });

  afterAll(async () => {
    await deactivatePlugin('classic-editor');
  });

  it('should allow inserting shortcode via modal', async () => {
    await visitAdminPage('post-new.php');

    // Ensure we're in the visual editor.
    await expect(page).toClick('#content-tmce');

    await expect(page).toClick('.mce-web-stories button');

    await page.waitForSelector('.components-modal__frame', {
      visible: true,
    });

    await percySnapshot(page, 'TinyMCE dialog');

    await expect(page).toMatch('Archive Link Label');

    await expect(page).toClick('button', { text: 'Insert' });

    // Switch to HTML mode
    await expect(page).toClick('#content-html');

    // Get content of textarea.
    const textEditorContent = await page.$eval(
      '.wp-editor-area',
      (element) => element.value
    );

    expect(textEditorContent).toMatch('[web_stories');
  });
});
