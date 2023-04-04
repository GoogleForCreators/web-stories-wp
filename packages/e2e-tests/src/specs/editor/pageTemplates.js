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

/**
 * External dependencies
 */
import {
  takeSnapshot,
  addTextElement,
  clearLocalStorage,
  createNewStory,
} from '@web-stories-wp/e2e-test-utils';

jest.retryTimes(3, { logErrorsBeforeRetry: true });

describe('Page Templates', () => {
  beforeAll(async () => {
    // force to load default templates in the page template pane.
    await clearLocalStorage();
  });

  it('should be able to load an create custom page templates', async () => {
    await createNewStory();

    await expect(page).toMatchElement('input[placeholder="Add title"]');

    // Use keyboard to open Page Templates panel.
    await page.focus('ul[aria-label="Element Library Selection"] li');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('Enter');

    await expect(page).toMatchElement('button[aria-disabled="true"]', {
      text: 'Save current page as template',
    });
    await expect(page).toMatchElement(
      'button[aria-label="Select templates type"]'
    );
    await expect(page).toMatchTextContent('Default templates');

    await addTextElement();

    // Go back to the templates panel.
    await page.click('#library-tab-pageTemplates');

    await expect(page).toMatchElement('button[aria-disabled="false"]', {
      text: 'Save current page as template',
    });

    await expect(page).toClick('button', {
      text: 'Save current page as template',
    });

    await page.waitForSelector('[role="dialog"]');

    // Add a name for the template
    await page.type('input[placeholder="Untitled"]', 'Test template');

    // Close dialog
    await page.keyboard.press('Enter');

    // Adding a custom page template automatically switches to the "Saved Templates" view.
    await expect(page).toMatchTextContent('Page Template saved.');
    await expect(page).toMatchTextContent('Saved templates');
    await expect(page).toMatchElement(
      '[aria-label="Page Template Options"] [role="listitem"]'
    );

    await takeSnapshot(page, 'Page Templates');
  });

  it('should be able search default page templates', async () => {
    await createNewStory();
    await page.click('#library-tab-pageTemplates');
    await page.click('[aria-label="Search"]');
    await page.keyboard.type('baking');
    await page.keyboard.press('Enter');

    // Fresh & Bright Cover template should not be on the page
    await expect(page).not.toMatchElement(
      'button[aria-label="Fresh & Bright Cover"]'
    );

    await takeSnapshot(page, 'Search Default Page Templates');

    await page.click('[aria-label="Clear Search"]');

    // Fresh & Bright Cover template should be on the page
    await expect(page).toMatchElement(
      'button[aria-label="Fresh & Bright Cover"]'
    );
  });

  it('should be able search saved page templates', async () => {
    await createNewStory();
    await page.click('#library-tab-pageTemplates');
    await createNewStory();

    await expect(page).toMatchElement('input[placeholder="Add title"]');

    // Use keyboard to open Page Templates panel.
    await page.focus('ul[aria-label="Element Library Selection"] li');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('Enter');

    await expect(page).toMatchElement('button[aria-disabled="true"]', {
      text: 'Save current page as template',
    });
    await expect(page).toMatchElement(
      'button[aria-label="Select templates type"]'
    );
    await expect(page).toMatchTextContent('Default templates');

    await addTextElement();

    // Go back to the templates panel.
    await page.click('#library-tab-pageTemplates');

    await expect(page).toMatchElement('button[aria-disabled="false"]', {
      text: 'Save current page as template',
    });

    await expect(page).toClick('button', {
      text: 'Save current page as template',
    });

    await page.waitForSelector('[role="dialog"]');

    // Add a name for the template
    await page.type('input[placeholder="Untitled"]', 'Test template');

    // Close dialog
    await page.keyboard.press('Enter');

    await page.click('[aria-label="Search"]');
    await page.keyboard.type('Test Template');
    await page.keyboard.press('Enter');

    await expect(page).toMatchElement('[aria-label="Test template"]');
  });

  it('should be able rename saved page templates', async () => {
    await createNewStory();
    await page.click('#library-tab-pageTemplates');
    await createNewStory();

    await expect(page).toMatchElement('input[placeholder="Add title"]');

    // Use keyboard to open Page Templates panel.
    await page.focus('ul[aria-label="Element Library Selection"] li');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('Enter');

    await expect(page).toMatchElement('button[aria-disabled="true"]', {
      text: 'Save current page as template',
    });
    await expect(page).toMatchElement(
      'button[aria-label="Select templates type"]'
    );
    await expect(page).toMatchTextContent('Default templates');

    await addTextElement();

    // Go back to the templates panel.
    await page.click('#library-tab-pageTemplates');

    await expect(page).toMatchElement('button[aria-disabled="false"]', {
      text: 'Save current page as template',
    });

    await expect(page).toClick('button', {
      text: 'Save current page as template',
    });

    await page.waitForSelector('[role="dialog"]');

    // Add a name for the template
    await page.type('input[placeholder="Untitled"]', 'template name');
    await page.keyboard.press('Enter');

    await expect(page).toMatchElement(
      '[aria-label="template name"][role="listitem"]'
    );

    await page.hover('[aria-label="template name"][role="listitem"]');

    await page.click('[aria-label="More"]');
    await page.click('li[role="menuitem"]');

    await page.click('input[placeholder="template name"]');
    await page.keyboard.press('Backspace');
    await page.keyboard.type('new template name');
    await page.keyboard.press('Enter');

    await expect(page).toMatchElement(
      '[aria-label="new template name"][role="listitem"]'
    );
  });
});
