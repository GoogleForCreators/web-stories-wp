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
import { visitAdminPage } from '@wordpress/e2e-test-utils';

describe('Widget screens', () => {
  beforeEach(async () => {
    // Remove all widgets
    await visitAdminPage('widgets.php');
    await page.evaluate(() => {
      const widgets = document.querySelectorAll(
        '#widgets-right .widget .widget-action'
      );
      for (const widget of widgets) {
        widget.click();
      }

      const widgetsDelete = document.querySelectorAll(
        '#widgets-right .widget .widget-control-remove'
      );
      for (const widgetDelete of widgetsDelete) {
        widgetDelete.click();
      }
    });
  });
  it('should be able to create widget from widget screen', async () => {
    await visitAdminPage('widgets.php');
    await expect(page).toMatch('Web Stories');
    await expect(page).toClick('button', { text: 'Add widget: Web Stories' });
    await expect(page).toClick('button', { text: 'Add Widget' });
    await expect(page).toMatchElement(
      '.widget-liquid-right .stories-field-wrapper'
    );

    await page.evaluate(() => {
      const input = document.querySelector(
        '.widget-liquid-right .stories-field-wrapper input'
      );
      input.value = '';
    });

    await page.type(
      '.widget-liquid-right .stories-field-wrapper input',
      'Test widget'
    );

    await expect(page).toMatchElement('.widget-control-save');

    await page.keyboard.press('Enter');

    await expect(page).toMatchElement('.widget-control-save:disabled');
  });
  it('should be able to create widget from customizer', async () => {
    await visitAdminPage('customize.php');
    await expect(page).toClick('li', { text: 'Widgets' });
    await expect(page).toClick('#sub-accordion-panel-widgets .control-section');
    await expect(page).toClick('button', { text: 'Add a Widget' });
    await expect(page).toMatch('Web Stories');

    await page.type('#widgets-search', 'web stories');

    await expect(page).toClick("div[class*='web_stories_widget-']");

    await page.evaluate(() => {
      const input = document.querySelector('.stories-field-wrapper input');
      input.value = '';
    });

    await page.type('.stories-field-wrapper input', 'Test widget');

    await page.keyboard.press('Enter');

    await page.waitForSelector('.spinner', {
      visible: false,
    });

    const frameHandle = await page.$("iframe[title='Site Preview']");
    const frame = await frameHandle.contentFrame();
    await expect(frame).toMatchElement('.google-stories-widget');
    await expect(frame).toMatch('Test widget');
  });
});
