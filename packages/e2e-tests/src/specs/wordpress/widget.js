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
  withPlugin,
  insertWidget,
  activatePlugin,
} from '@web-stories-wp/e2e-test-utils';

jest.retryTimes(3, { logErrorsBeforeRetry: true });

describe('Web Stories Widget', () => {
  withPlugin('classic-widgets');

  beforeEach(async () => {
    await deleteWidgets();
    await activatePlugin('classic-widgets');
  });

  describe('Widgets Screen', () => {
    it('should be able to add widget', async () => {
      await visitAdminPage('widgets.php');

      await insertWidget('Web Stories');

      await expect(page).toMatchElement(
        '.widget-liquid-right .web-stories-field-wrapper'
      );

      await page.$eval(
        '.widget-liquid-right .web-stories-field-wrapper input',
        (input) => (input.value = '')
      );

      await page.type(
        '.widget-liquid-right .web-stories-field-wrapper input',
        'Test widget'
      );

      await expect(page).toClick(
        '.widget-liquid-right .widget-control-save:not(:disabled)'
      );

      await page.waitForSelector('.spinner', {
        visible: false,
      });

      await expect(page).toMatchElement(
        '.widget-control-close-wrapper .widget-control-close',
        {
          text: 'Done',
        }
      );
    });
  });

  describe('Customizer', () => {
    it('should be able to add widget', async () => {
      await visitAdminPage('customize.php');

      await expect(page).toClick('li', { text: 'Widgets' });

      await expect(page).toMatchElement('.control-panel-widgets.current-panel');
      await expect(page).toMatchElement(
        '#accordion-section-sidebar-widgets-sidebar-1 .accordion-section-title'
      );

      // The customizer has lots of transition animations.
      await page.waitForTimeout(500);

      // expect(page).toClick(...) doesn't seem to work.
      await page.evaluate(() => {
        document
          .querySelector(
            '#accordion-section-sidebar-widgets-sidebar-1 .accordion-section-title'
          )
          .click();
      });

      // The customizer has lots of transition animations.
      await page.waitForTimeout(500);

      await expect(page).toClick('button', { text: 'Add a Widget' });

      await expect(page).toMatchTextContent('Web Stories');

      await page.type('#widgets-search', 'web stories');

      await expect(page).toClick("div[class*='web_stories_widget-']");

      // The customizer has lots of transition animations.
      await page.waitForTimeout(500);

      await page.$eval(
        '.web-stories-field-wrapper input',
        (input) => (input.value = '')
      );

      await page.type('.web-stories-field-wrapper input', 'Test widget');

      await page.keyboard.press('Enter');

      await page.waitForResponse(
        (response) =>
          // eslint-disable-next-line jest/no-conditional-in-test
          response.url().includes('/wp-admin/admin-ajax.php') &&
          response.status() === 200
      );

      await page.waitForSelector('.spinner', {
        visible: false,
      });

      await expect(page).toClick('.widget-control-close', { text: 'Done' });

      await expect(page).toClick('#save');
      await expect(page).toMatchElement('#save[value="Published"]');

      await page.waitForResponse(
        (response) =>
          // eslint-disable-next-line jest/no-conditional-in-test
          response.url().includes('/wp-admin/admin-ajax.php') &&
          response.status() === 200
      );

      await page.waitForSelector('.spinner', {
        visible: false,
      });

      await page.waitForSelector("iframe[title='Site Preview']");
      const frameHandle = await page.$("iframe[title='Site Preview']");
      const frame = await frameHandle.contentFrame();
      expect(frame).not.toBeNull();
      await expect(frame).toMatchElement('.web-stories-widget');
    });
  });
});
