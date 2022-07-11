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

describe('Web Stories Widget', () => {
  withPlugin('classic-widgets');

  beforeEach(async () => {
    await deleteWidgets();
    await activatePlugin('classic-widgets');
  });

  // eslint-disable-next-line jest/no-disabled-tests
  describe.skip('Widgets Screen', () => {
    it('should be able to add widget', async () => {
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
    });
  });

  // See https://github.com/googleforcreators/web-stories-wp/issues/6879
  // eslint-disable-next-line jest/no-disabled-tests -- Flakey test that needs to be investigated.
  describe.skip('Customizer', () => {
    it('should be able to add widget', async () => {
      await visitAdminPage('customize.php');

      await expect(page).toClick('li', { text: 'Widgets' });

      await expect(page).toMatchElement('.control-panel-widgets.current-panel');
      await expect(page).toMatchElement(
        '#accordion-section-sidebar-widgets-sidebar-1 .accordion-section-title'
      );

      // expect(page).toClick(...) doesn't seem to work.
      await page.evaluate(() => {
        document
          .querySelector(
            '#accordion-section-sidebar-widgets-sidebar-1 .accordion-section-title'
          )
          .click();
      });

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

      await expect(page).toClick('#save');
      await expect(page).toMatchElement('#save[value="Published"]');

      // TODO: Ensure this works reliably in tests.

      //const frameHandle = await page.$("iframe[title='Site Preview']");
      //const frame = await frameHandle.contentFrame();
      //await expect(frame).toMatchElement('.web-stories-widget');
      //await expect(frame).toMatch('Test widget');
    });
  });
});
