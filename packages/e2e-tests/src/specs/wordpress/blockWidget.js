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

/**
 * Internal dependencies
 */
import { addAllowedErrorMessage } from '../../config/bootstrap.js';

describe('Web Stories Widget Block', () => {
  let removeErrorMessage;

  minWPVersionRequired('5.8');

  beforeAll(async () => {
    // Known issue in WP 6.0 RC1, see https://github.com/GoogleForCreators/web-stories-wp/pull/11435
    removeErrorMessage = addAllowedErrorMessage(
      "Warning: Can't perform a React state update on an unmounted component."
    );

    await deleteWidgets();
  });

  afterEach(async () => {
    await deleteWidgets();
  });

  afterAll(() => {
    removeErrorMessage();
  });

  it('should insert a new web stories block', async () => {
    await visitBlockWidgetScreen();
    await expect(page).toClick('button[aria-label="Add block"]');
    await page.type('input[placeholder="Search"]', 'Web Stories');
    await expect(page).toClick('button span', { text: 'Web Stories' });

    await page.waitForSelector('.web-stories-block-configuration-panel');
    await expect(page).toClick('.web-stories-block-configuration-panel');

    await expect(page).toClick('button[aria-label="Embed a single story."]');

    await expect(page).toMatch(
      'Select an existing story from your site, or add one with a URL.'
    );
    await expect(page).toClick('button', { text: 'Insert from URL' });

    await page.type(
      'input[aria-label="Story URL"]',
      'https://wp.stories.google/stories/intro-to-web-stories-storytime'
    );
    await expect(page).toClick('button[aria-label="Embed"]');

    await expect(page).not.toMatch(
      'Sorry, this content could not be embedded.'
    );

    // Wait a little longer for embed REST API request to come back.
    await page.waitForSelector('amp-story-player');
    await expect(page).toMatchElement('amp-story-player');
    await expect(page).toMatch('Embed Settings');
  });

  // eslint-disable-next-line jest/no-disabled-tests -- TimeoutError: Element .widget-liquid-right .web-stories-field-wrapper not found
  it.skip('should insert a legacy web stories widget', async () => {
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

    await page.waitForSelector(selector);
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
