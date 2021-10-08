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
import percySnapshot from '@percy/puppeteer';
import { addTextElement, createNewStory } from '@web-stories-wp/e2e-test-utils';

describe('Page Templates', () => {
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
    await expect(page).toMatch('Default templates');

    await addTextElement();

    await expect(page).toMatchElement('button[aria-disabled="false"]', {
      text: 'Save current page as template',
    });

    await expect(page).toClick('button', {
      text: 'Save current page as template',
    });

    // Adding a custom page template automatically switches to the "Saved Templates" view.

    await expect(page).toMatch('Saved templates');
    await expect(page).toMatchElement(
      '[aria-label="Page Template Options"] [role="listitem"]'
    );

    await percySnapshot(page, 'Page Templates');
  });
});
