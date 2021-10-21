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
import { visitSettings } from '@web-stories-wp/e2e-test-utils';

const INPUT_SELECTOR = '[aria-label="Enter your Google Analytics Tracking ID"]';

describe('Analytics', () => {
  beforeEach(async () => {
    await visitSettings();
  });

  it('should render', async () => {
    const settingsView = await page.$('[data-testid="editor-settings"]');
    expect(settingsView).toBeTruthy();

    await expect(page).toMatchElement('h2', { text: 'Settings' });
  });

  it('should update the tracking id when pressing enter and display snackbar confirmation', async () => {
    await page.click(INPUT_SELECTOR);

    const inputLength = await page.$eval(INPUT_SELECTOR, (el) => {
      return el.value.length;
    });

    for (let iter = 0; iter < inputLength; iter++) {
      // disable eslint to prevent overlapping .act calls
      // eslint-disable-next-line no-await-in-loop
      await page.keyboard.press('Backspace');
    }

    await page.keyboard.type('UA-009345-10');
    await page.keyboard.press('Enter');

    await page.waitForTimeout(400);
    await expect(page).toMatch('Setting saved.');
  });

  it('should update the tracking id by clicking the save button and display snackbar confirmation', async () => {
    await page.hover(INPUT_SELECTOR);
    await page.click(INPUT_SELECTOR);

    const inputLength = await page.$eval(INPUT_SELECTOR, (el) => {
      return el.value.length;
    });

    for (let iter = 0; iter < inputLength; iter++) {
      // disable eslint to prevent overlapping .act calls
      // eslint-disable-next-line no-await-in-loop
      await page.keyboard.press('Backspace');
    }

    await page.keyboard.type('UA-009345-11');
    await expect(page).toClick('button', { text: 'Save' });

    await page.waitForTimeout(400);
    await expect(page).toMatch('Setting saved.');
  });

  it('should allow the analytics id to be saved as an empty string and display snackbar confirmation', async () => {
    await page.click(INPUT_SELECTOR);
    const inputLength = await page.$eval(INPUT_SELECTOR, (el) => {
      return el.value.length;
    });

    for (let iter = 0; iter < inputLength; iter++) {
      // disable eslint to prevent overlapping .act calls
      // eslint-disable-next-line no-await-in-loop
      await page.keyboard.press('Backspace');
    }

    await expect(page).toClick('button', { text: 'Save' });

    await page.waitForTimeout(400);
    await expect(page).toMatch('Setting saved.');
  });

  it('should not allow an invalid analytics id to be saved', async () => {
    await page.click(INPUT_SELECTOR);
    const inputLength = await page.$eval(INPUT_SELECTOR, (el) => {
      return el.value.length;
    });

    for (let iter = 0; iter < inputLength; iter++) {
      // disable eslint to prevent overlapping .act calls
      // eslint-disable-next-line no-await-in-loop
      await page.keyboard.press('Backspace');
    }
    await page.keyboard.type('INVALID');
    await expect(page).toClick('button', { text: 'Save' });

    await page.waitForTimeout(400);
    await expect(page).not.toMatch('Setting saved.');
    await expect(page).toMatch('Invalid ID format');
  });

  it("should not allow an update of google analytics id when id format doesn't match required format", async () => {
    await page.click(INPUT_SELECTOR);

    const inputLength = await page.$eval(INPUT_SELECTOR, (el) => {
      return el.value.length;
    });

    for (let iter = 0; iter < inputLength; iter++) {
      // disable eslint to prevent overlapping .act calls
      // eslint-disable-next-line no-await-in-loop
      await page.keyboard.press('Backspace');
    }
    await page.keyboard.type('Clearly not a valid id');
    await page.keyboard.press('Enter');

    await page.waitForTimeout(400);
    await expect(page).not.toMatch('Setting saved.');
    await expect(page).toMatch('Invalid ID format');
  });
});
