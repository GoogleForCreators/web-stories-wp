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
  skipSuiteOnFirefox,
  takeSnapshot,
} from '@web-stories-wp/e2e-test-utils';

/**
 * Internal dependencies
 */
import { addAllowedErrorMessage } from '../../config/bootstrap.js';

describe('Web Stories Widget Block', () => {
  let removeErrorMessage;

  beforeAll(() => {
    // Known issue in WP 6.0 RC1, see https://github.com/GoogleForCreators/web-stories-wp/pull/11435
    removeErrorMessage = addAllowedErrorMessage(
      "Warning: Can't perform a React state update on an unmounted component."
    );
  });

  afterEach(async () => {
    await deleteWidgets();
  });

  afterAll(() => {
    removeErrorMessage();
  });

  describe('Regular Block', () => {
    minWPVersionRequired('5.8');

    it('should insert a new Web Stories block', async () => {
      await visitBlockWidgetScreen();
      await expect(page).toClick(
        '.edit-widgets-header-toolbar button[aria-label="Toggle block inserter"]'
      );
      await page.waitForSelector(
        '.edit-widgets-layout__inserter-panel-content'
      );
      await page.type('input[placeholder="Search"]', 'Web Stories');
      await expect(page).toClick('button span', { text: 'Web Stories' });

      await page.waitForSelector('.web-stories-block-configuration-panel');
      await expect(page).toClick('.web-stories-block-configuration-panel');

      await expect(page).toClick('button[aria-label="Embed a single story."]');

      await expect(page).toMatch(
        'Select an existing story from your site, or add one with a URL.'
      );
      await expect(page).toClick('button', { text: 'Insert from URL' });

      await expect(page).toMatchElement('input[aria-label="Story URL"]');

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

      await takeSnapshot(page, 'Block Widgets - Regular Block');
    });
  });

  describe('Legacy Widget', () => {
    // The block toolbar is not reliably appearing on Firefox,
    // so conversion from legacy widget block to Web Stories block isn't working.
    skipSuiteOnFirefox();

    minWPVersionRequired('5.8');

    // eslint-disable-next-line jest/no-disabled-tests -- TODO(#11931): Fix flakey test.
    it.skip('should insert a legacy Web Stories widget', async () => {
      await activatePlugin('classic-widgets');

      await visitAdminPage('widgets.php');

      await insertWidget('Web Stories');
      await expect(page).toMatchElement(
        '.widget-liquid-right .web-stories-field-wrapper'
      );
      await expect(page).toMatchElement('label', { text: /Widget Title/ });

      await page.evaluate(() => {
        const input = document.querySelector(
          '.widget-liquid-right .web-stories-field-wrapper input'
        );
        input.value = '';
      });

      await page.type(
        '.widget-liquid-right .web-stories-field-wrapper input',
        'Test Widget'
      );

      await expect(page).toMatchElement(
        '.widget-liquid-right .widget-control-save'
      );
      await expect(page).toClick('.widget-liquid-right .widget-control-save');
      await expect(page).toMatchElement(
        '.widget-liquid-right .widget-control-save:disabled'
      );

      await takeSnapshot(page, 'Classic Widget');

      await deactivatePlugin('classic-widgets');
      await visitBlockWidgetScreen();

      // Wait for any widget blocks to render.
      await page.waitForFunction(
        () => !document.querySelector('.components-spinner')
      );

      await expect(page).toClick('.wp-block-legacy-widget');

      await expect(page).toMatchElement('label', { text: /Widget Title/ });

      await page.evaluate(() => {
        const input = document.querySelector(
          '.web-stories-field-wrapper input'
        );
        input.value = '';
      });

      await page.type('.web-stories-field-wrapper input', 'Test Block Widget');

      await page.keyboard.press('Tab');

      await page.waitForResponse((res) =>
        res
          .url()
          .includes('wp-json/wp/v2/widget-types/web_stories_widget/encode')
      );

      await page.waitForResponse((res) =>
        res.url().includes('widgets.php?legacy-widget-preview')
      );

      await expect(page).toMatchElement('label', { text: /Widget Title/ });
      await expect(page).toMatchElement(
        '.block-editor-block-toolbar .block-editor-block-switcher'
      );

      await takeSnapshot(page, 'Block Widgets - Legacy Widget Block');

      // TODO: Fix block transform.
      // Block transformation via the block toolbar is unstable, since
      // WordPress often is rendering the widget form twice instead of actually
      // showing the block transform options.
      // See https://imgur.com/a/Xe4zn8Z
      // For this reason, we transform the block programmatically.

      //await expect(page).toClick(
      //  '.block-editor-block-toolbar .block-editor-block-switcher button[aria-label="Legacy Widget"]'
      //);
      //await expect(page).toMatch(/Transform to/i);
      //await expect(page).toClick('button', { text: 'Web Stories' });

      await page.evaluate(() => {
        wp.data
          .dispatch('core/block-editor')
          .replaceBlock(
            [wp.data.select('core/block-editor').getSelectedBlockClientId()],
            wp.blocks.switchToBlockType(
              wp.data.select('core/block-editor').getSelectedBlock(),
              'web-stories/embed'
            )
          );
      });

      // Wait for transformed block to render.
      await page.waitForFunction(
        () => !document.querySelector('.components-spinner')
      );

      await expect(page).toMatch('Test Block Widget');

      await takeSnapshot(page, 'Block Widgets - Transformed Block');
    });
  });
});
