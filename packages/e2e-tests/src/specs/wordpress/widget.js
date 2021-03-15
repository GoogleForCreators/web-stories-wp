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
import { deleteWidgets } from '@web-stories-wp/e2e-test-utils';

/**
 * WordPress dependencies
 */
import { visitAdminPage } from '@wordpress/e2e-test-utils';

describe('Web Stories Widget', () => {
  beforeEach(async () => {
    await deleteWidgets();
  });

  describe('Widgets Screen', () => {
    it('should be able to add widget', async () => {
      await visitAdminPage('widgets.php');

      // Hotfix for WordPress 5.3 where `wpWidgets.l10n.widgetAdded`
      // is referenced by wp-admin/js/widgets.js, but doesn't actually exist.
      // See:
      // https://github.com/WordPress/wordpress-develop/blob/8eb0eb36e026ca5c7f7c8f84b28390709c98089b/src/wp-includes/script-loader.php#L1735-L1747
      // https://github.com/WordPress/wordpress-develop/blob/8eb0eb36e026ca5c7f7c8f84b28390709c98089b/src/js/_enqueues/admin/widgets.js#L721
      await page.evaluate(() => {
        if (window.wpWidgets?.l10n) {
          window.wpWidgets.l10n.widgetAdded = 'Widget added';
        }
      });

      await expect(page).toMatch('Web Stories');
      await expect(page).toClick('button', { text: 'Add widget: Web Stories' });
      await expect(page).toClick('button', { text: 'Add Widget' });
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
    });
  });

  describe('Customizer', () => {
    it('should be able to add widget', async () => {
      await visitAdminPage('customize.php');
      await expect(page).toClick('li', { text: 'Widgets' });
      // Targeting the first built-in widget area, Footer #1.
      await expect(page).toClick(
        '.control-panel-widgets.current-panel .control-section-sidebar .accordion-section-title'
      );
      await expect(page).toClick('button', { text: 'Add a Widget' });
      await expect(page).toMatch('Web Stories');

      await page.type('#widgets-search', 'web stories');

      await expect(page).toClick("div[class*='web_stories_widget-']");

      await page.evaluate(() => {
        const input = document.querySelector(
          '.web-stories-field-wrapper input'
        );
        input.value = '';
      });

      await page.type('.web-stories-field-wrapper input', 'Test widget');

      await page.keyboard.press('Enter');

      await page.waitForSelector('.spinner', {
        visible: false,
      });

      const frameHandle = await page.$("iframe[title='Site Preview']");
      const frame = await frameHandle.contentFrame();
      await expect(frame).toMatchElement('.web-stories-widget');
      await expect(frame).toMatch('Test widget');
    });
  });
});
