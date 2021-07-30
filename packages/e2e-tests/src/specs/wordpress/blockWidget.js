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
  deleteWidgets,
  visitAdminPage,
  activatePlugin,
  deactivatePlugin,
  visitBlockWidgetScreen,
  insertWidget,
  minWPVersionRequired,
} from '@web-stories-wp/e2e-test-utils';

describe('Web Stories Widget Block', () => {
  minWPVersionRequired('5.8');
  beforeEach(async () => {
    await deleteWidgets();
  });
  afterAll(async () => {
    await deleteWidgets();
  });

  it('should insert a new web stories block', async () => {
    await visitBlockWidgetScreen();
    await expect(page).toClick('button[aria-label="Add block"]');
    await page.type('.block-editor-inserter__search-input', 'Web Stories');
    await expect(page).toClick('button span', { text: 'Web Stories' });

    await page.waitForSelector('.web-stories-block-configuration-panel');
    await expect(page).toMatchElement('.web-stories-block-configuration-panel');

    await expect(page).toClick('button', { text: 'Story URL' });

    await expect(page).toMatchElement('input[aria-label="Story URL"]');

    await page.type(
      'input[aria-label="Story URL"]',
      'https://preview.amp.dev/documentation/examples/introduction/stories_in_amp'
    );
    await expect(page).toClick('button', { text: 'Embed' });

    await expect(page).not.toMatch(
      'Sorry, this content could not be embedded.'
    );

    // Wait a little longer for embed REST API request to come back.
    await page.waitForSelector('amp-story-player');
    await expect(page).toMatchElement('amp-story-player');
    await expect(page).toMatch('Embed Settings');
  });

  it('should insert a legacy web stories widget', async () => {
    await activatePlugin('classic-widgets');

    await visitAdminPage('widgets.php');

    await insertWidget('Web Stories');
    await expect(page).toMatchElement(
      '.widget-liquid-right .web-stories-field-wrapper'
    );

    await page.evaluate(() => {
      const input = document.querySelector(
        '.widget-liquid-right .web-stories-field-wrapper input'
      );
      input.value = '';
    });

    await page.type(
      '.widget-liquid-right .web-stories-field-wrapper input',
      'Test widget'
    );

    await expect(page).toMatchElement(
      '.widget-liquid-right .widget-control-save'
    );

    await page.keyboard.press('Enter');

    await expect(page).toMatchElement(
      '.widget-liquid-right .widget-control-save:disabled'
    );

    await deactivatePlugin('classic-widgets');
    await visitBlockWidgetScreen();
    const selector = '.wp-block-legacy-widget';

    await expect(page).toMatchElement(selector);
    await expect(page).toClick(selector);

    await page.evaluate(() => {
      const input = document.querySelector('.web-stories-field-wrapper input');
      input.value = '';
    });

    await page.type('.web-stories-field-wrapper input', 'Test Block Widget');
    await page.keyboard.press('Escape');
    await expect(page).toMatchElement(selector);
    await expect(page).toClick(selector);
    await expect(page).toClick(
      '.components-dropdown button[aria-label="Legacy Widget"]'
    );
    await expect(page).toClick('button', { text: 'Web Stories' });
    await expect(page).toMatch('Test Block Widget');
  });
});
