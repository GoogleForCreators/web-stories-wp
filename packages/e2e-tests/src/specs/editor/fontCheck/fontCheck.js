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
  withExperimentalFeatures,
  createNewStory,
  visitAdminPage,
  insertStoryTitle,
  publishStory,
  takeSnapshot,
  addCustomFont,
  removeCustomFont,
} from '@web-stories-wp/e2e-test-utils';

const createStoryWithTitle = async (title) => {
  await createNewStory();
  await insertStoryTitle(title);
  await expect(page).toClick('#library-tab-text');
  const insertButton = await page.waitForXPath(
    `//button//span[contains(text(), 'Title 1')]`
  );
  await insertButton.click();
  await expect(page).toMatchElement('[data-testid="textFrame"]', {
    text: 'Title 1',
  });
};

const updateFont = async (fontFamily) => {
  await expect(page).toClick('button[aria-label="Font family"]');
  await page.keyboard.type(fontFamily);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
};

const visitStoryWithTitle = async (title) => {
  await visitAdminPage('edit.php', 'post_type=web-story');
  await expect(page).toClick('a', { text: title });
};

const replaceFontWithFontPicker = async (fontFamily = '') => {
  await page.waitForSelector('[role="dialog"]');
  await expect(page).toMatchElement('button', { text: 'Open anyway' });
  await expect(page).toMatchElement('button', { text: 'Replace font' });
  await takeSnapshot(page, 'Missing fonts dialog');
  await expect(page).toClick(
    "div[role='dialog'] div[class^='datalist__'] button"
  );
  await page.keyboard.type(fontFamily);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page).toClick('button', { text: 'Replace font' });
  await expect(page).toClick('[data-testid="textFrame"]');
  await expect(page).toClick('button[aria-label="Font family"]');
};

const replaceFontUsingDefault = async () => {
  await page.waitForSelector('[role="dialog"]');
  await expect(page).toClick('button', { text: 'Open anyway' });
  await expect(page).toClick('[data-testid="textFrame"]');
  await expect(page).toClick('button[aria-label="Font family"]');
};

const storyWithFontCheckDialog = async (
  title,
  customFont = 'Open Sans Condensed Light'
) => {
  // take steps needed to get Missing Font dialog to show
  await addCustomFont();
  await createStoryWithTitle(title);
  await updateFont(customFont);
  await publishStory();
  await removeCustomFont();
  await visitStoryWithTitle(title);
  await page.waitForSelector('[data-testid="textFrame"]');
  await page.waitForSelector('[role="dialog"]');
};

describe('Font Check', () => {
  withExperimentalFeatures(['customFonts']);
  withExperimentalFeatures(['notifyDeletedFonts']);

  it('should show dialog & replace font with default font', async () => {
    const title = 'Test replace missing font with (default) Roboto';
    const replacementFont = 'Roboto';
    await storyWithFontCheckDialog(title);
    await replaceFontUsingDefault(replacementFont);
    const selectedText = await page.$eval(
      'div[role="dialog"] li[aria-selected="true"]',
      (el) => el.textContent
    );
    await expect(selectedText).toBe(replacementFont);
  });

  it('should show dialog & replace it with selected font', async () => {
    const title = 'Test replace missing font with Bungee';
    const replacementFont = 'Bungee';
    await storyWithFontCheckDialog(title);
    await replaceFontWithFontPicker(replacementFont);
    const selectedText = await page.$eval(
      'div[role="dialog"] li[aria-selected="true"]',
      (el) => el.textContent
    );
    await expect(selectedText).toBe(replacementFont);
  });

  it('should show dialog & visit settings page', async () => {
    const title = 'Test visit to settings from dialog';
    await storyWithFontCheckDialog(title);
    await Promise.all([
      expect(page).toClick('[role="dialog"] a', { text: 'Settings' }),
      page.waitForNavigation(),
    ]);
    await expect(page).toMatchElement('h2', { text: 'Settings' });
  });

  it('should show dialog & visit dashboard page', async () => {
    const title = 'Test back to dashboard from dialog';
    await storyWithFontCheckDialog(title);
    await Promise.all([
      expect(page).toClick('a', { text: 'Back to dashboard' }),
      page.waitForNavigation(),
    ]);
    await expect(page).toMatchElement('h2', { text: 'Dashboard' });
  });

  it('should visit dashboard page clicking outside dialog', async () => {
    const title = 'Test back to dashboard from dialog';
    await storyWithFontCheckDialog(title);
    // click outside the dialog
    await Promise.all([
      await page.mouse.click(100, 100),
      page.waitForNavigation(),
    ]);
    await expect(page).toMatchElement('h2', { text: 'Dashboard' });
  });
});
