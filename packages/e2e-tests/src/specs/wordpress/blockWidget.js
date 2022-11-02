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
} from '@web-stories-wp/e2e-test-utils';

/**
 * Internal dependencies
 */
import { addAllowedErrorMessage } from '../../config/bootstrap';

jest.retryTimes(3, { logErrorsBeforeRetry: true });

describe('Web Stories Widget Block', () => {
  let removeErrorMessage;

  beforeAll(() => {
    // Known issue in WP 6.0 RC1, see https://github.com/GoogleForCreators/web-stories-wp/pull/11435
    removeErrorMessage = addAllowedErrorMessage(
      "Warning: Can't perform a React state update on an unmounted component."
    );
  });

  beforeEach(async () => {
    await deleteWidgets();
  });

  afterEach(async () => {
    await deleteWidgets();
  });

  afterAll(() => {
    removeErrorMessage();
  });

  it('should insert a new Web Stories block', async () => {
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

    await page.waitForFunction(
      () => !document.querySelector('.wp-block-web-stories-embed.is-loading')
    );

    await expect(page).not.toMatch(
      'Sorry, this content could not be embedded.'
    );

    // Wait a little longer for embed REST API request to come back.
    await page.waitForSelector('amp-story-player');
    await expect(page).toMatchElement('amp-story-player');
    await expect(page).toMatch('Embed Settings');
  });

  it('should insert and transform a legacy Web Stories widget', async () => {
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

    await Promise.all([
      expect(page).toClick(
        '.widget-liquid-right .widget-control-save:not(:disabled)'
      ),
      page.waitForResponse(
        (response) =>
          // eslint-disable-next-line jest/no-conditional-in-test
          response.url().includes('/wp-admin/admin-ajax.php') &&
          response.status() === 200
      ),
    ]);

    await expect(page).toMatchElement(
      '.widget-liquid-right .widget-control-save:disabled'
    );

    await deactivatePlugin('classic-widgets');

    await visitBlockWidgetScreen();

    // Wait for widget to render.
    await page.waitForSelector('.wp-block-legacy-widget__edit-preview');

    await expect(page).toClick('.wp-block-legacy-widget');
    await expect(page).toMatchElement('.web-stories-field-wrapper', {
      visible: true,
    });

    await page.evaluate(() => {
      const input = document.querySelector('.web-stories-field-wrapper input');
      input.value = '';
    });

    await Promise.all([
      page.type('.web-stories-field-wrapper input', 'Test Block Widget'),

      page.waitForResponse(
        (response) =>
          // eslint-disable-next-line jest/no-conditional-in-test
          response.url().includes('wp/v2/widget-types/web_stories_widget') &&
          response.status() === 200
      ),
    ]);

    await expect(page).toClick('.components-button.is-primary', {
      text: 'Update',
    });

    await expect(page).toClick('.wp-block-legacy-widget');

    // More reliable here than toClick(), page.click(), or transformBlockTo()
    await page.evaluate(() =>
      document.querySelector('button[aria-label="Legacy Widget"]').click()
    );

    await expect(page).toClick('button[role="menuitem"]', {
      text: 'Web Stories',
    });

    // The core/legacy-widget block should have been replaced by core/heading + web-stories/embed.
    const widgetBlocks = await page.evaluate(() =>
      wp.data
        .select('core/block-editor')
        .getBlocks(wp.data.select('core/block-editor').getBlockOrder()[0])
        .map(({ name }) => name)
        .join(',')
    );
    await expect(widgetBlocks).toBe('core/heading,web-stories/embed');
  });
});
