/*
 * Copyright 2022 Google LLC
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
  createNewStory,
  editStoryWithTitle,
  insertStoryTitle,
  publishStory,
  takeSnapshot,
  addCustomFont,
  removeCustomFont,
  visitSettings,
  removeAllFonts,
} from '@web-stories-wp/e2e-test-utils';

const OPEN_SANS_CONDENSED_LIGHT = 'Open Sans Condensed Light';
const OPEN_SANS_CONDENSED_LIGHT_URL = `${process.env.WP_BASE_URL}/wp-content/e2e-assets/OpenSansCondensed-Light.ttf`;

async function changeFont(fontName) {
  await expect(page).toClick('button[aria-label="Font family"]');
  await page.keyboard.type(fontName);
  await page.waitForResponse(
    (response) =>
      response.url().includes('web-stories/v1/fonts/?search=') &&
      response.status() === 200
  );
  await expect(page).toMatchElement('li[role="option"]', {
    text: fontName,
  });
  await expect(page).toClick('li[role="option"]', {
    text: fontName,
  });
  await expect(page).toMatchElement('button[aria-label="Font family"]', {
    text: fontName,
  });
}

async function createStoryWithFont(title) {
  await createNewStory();
  await insertStoryTitle(title);
  await expect(page).toClick('#library-tab-text');
  const insertButton = await page.waitForSelector(
    `xpath/.//button//span[contains(text(), 'Title 1')]`
  );
  await insertButton.click();
  await expect(page).toMatchElement('[data-testid="textFrame"]', {
    text: 'Title 1',
  });

  await changeFont(OPEN_SANS_CONDENSED_LIGHT);

  await publishStory();
}

async function replaceFontWithFontPicker(fontFamily = '') {
  await changeFont(fontFamily);

  await expect(page).toClick('button', { text: 'Replace font' });
  await expect(page).toClick('[data-testid="textFrame"]');
}

async function replaceFontUsingDefault() {
  await expect(page).toClick('button', { text: 'Open anyway' });
  await expect(page).toClick('[data-testid="textFrame"]');
}

async function prepareStoryWithFontCheckDialog(title) {
  await createStoryWithFont(title);

  await visitSettings();
  await removeCustomFont(OPEN_SANS_CONDENSED_LIGHT);

  await editStoryWithTitle(title);

  await page.waitForSelector('[data-testid="textFrame"]');
  await page.waitForSelector('[role="dialog"][aria-label="Missing Fonts"]');
  await expect(page).toMatchElement('button', { text: 'Open anyway' });
  await expect(page).toMatchElement('button', { text: 'Replace font' });
}

jest.retryTimes(2, { logErrorsBeforeRetry: true });

describe('Font Check', () => {
  beforeAll(async () => {
    await visitSettings();
    await removeAllFonts();
  });

  beforeEach(async () => {
    await visitSettings();
    await addCustomFont(OPEN_SANS_CONDENSED_LIGHT_URL);
  });

  afterAll(async () => {
    await visitSettings();
    await removeAllFonts();
  });

  it('should show dialog & replace font with default font', async () => {
    const title = 'Test replace missing font with (default) Roboto';
    const replacementFont = 'Roboto';
    await prepareStoryWithFontCheckDialog(title);

    await takeSnapshot(page, 'Missing fonts dialog');

    await replaceFontUsingDefault(replacementFont);

    await expect(page).toMatchElement('button[aria-label="Font family"]', {
      text: replacementFont,
    });
  });

  it('should show dialog & replace it with selected font', async () => {
    const title = 'Test replace missing font with Bungee';
    const replacementFont = 'Bungee';
    await prepareStoryWithFontCheckDialog(title);
    await replaceFontWithFontPicker(replacementFont);

    await expect(page).toClick('[data-testid="textFrame"]');

    await expect(page).toMatchElement('button[aria-label="Font family"]', {
      text: replacementFont,
    });
  });

  it('should show dialog & visit settings page', async () => {
    const title = 'Test visit to settings from dialog';
    await prepareStoryWithFontCheckDialog(title);
    await Promise.all([
      expect(page).toClick('[role="dialog"][aria-label="Missing Fonts"] a', {
        text: 'Settings',
      }),
      page.waitForNavigation(),
    ]);
    await expect(page).toMatchElement('h2', { text: 'Settings' });
  });

  it('should show dialog & visit dashboard page', async () => {
    const title = 'Test back to dashboard from dialog';
    await prepareStoryWithFontCheckDialog(title);
    await Promise.all([
      expect(page).toClick('a', { text: 'Back to dashboard' }),
      page.waitForNavigation(),
    ]);
    await expect(page).toMatchElement('h2', { text: 'Dashboard' });
  });

  it('should redirect to dashboard when clicking outside dialog', async () => {
    const title = 'Test back to dashboard from dialog';
    await prepareStoryWithFontCheckDialog(title);
    // click outside the dialog
    await Promise.all([
      await page.mouse.click(100, 100),
      page.waitForNavigation(),
    ]);
    await expect(page).toMatchElement('h2', { text: 'Dashboard' });
  });

  it('should redirect to dashboard when pressing ESC', async () => {
    const title = 'Test back to dashboard from dialog';
    await prepareStoryWithFontCheckDialog(title);
    await Promise.all([
      await page.keyboard.press('Escape'),
      page.waitForNavigation(),
    ]);
    await expect(page).toMatchElement('h2', { text: 'Dashboard' });
  });
});
