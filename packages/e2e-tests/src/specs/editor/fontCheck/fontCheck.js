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
  editStoryWithTitle,
  insertStoryTitle,
  publishStory,
  takeSnapshot,
  addCustomFont,
  removeCustomFont,
} from '@web-stories-wp/e2e-test-utils';

const OPEN_SANS_CONDENSED = 'Open Sans Condensed Light';
const OPEN_SANS_CONDENSED_URL = `${process.env.WP_BASE_URL}/wp-content/e2e-assets/OpenSansCondensed-Light.ttf`;

async function createStoryWithTitle(title) {
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
}

async function updateFont(fontFamily) {
  // Open style pane
  await expect(page).toClick('li[role="tab"]', { text: /^Style$/ });
  await expect(page).toClick('button[aria-label="Font family"]');
  await page.keyboard.type(fontFamily);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
}

async function replaceFontWithFontPicker(fontFamily = '') {
  await page.waitForSelector('[role="dialog"]');
  await expect(page).toMatchElement('button', { text: 'Open anyway' });
  await expect(page).toMatchElement('button', { text: 'Replace font' });
  await expect(page).toClick('button[aria-label="Font family"]');
  await page.keyboard.type(fontFamily);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page).toClick('button', { text: 'Replace font' });
  await expect(page).toClick('[data-testid="textFrame"]');
  await expect(page).toClick('li[role="tab"]', { text: /^Style$/ });
}

async function replaceFontUsingDefault() {
  await page.waitForSelector('[role="dialog"]');
  await expect(page).toClick('button', { text: 'Open anyway' });
  await expect(page).toClick('[data-testid="textFrame"]');
}

async function storyWithFontCheckDialog(title) {
  // take steps needed to get Missing Font dialog to show
  await addCustomFont(OPEN_SANS_CONDENSED_URL);
  await createStoryWithTitle(title);
  await updateFont(OPEN_SANS_CONDENSED);
  await publishStory();
  await removeCustomFont();
  await editStoryWithTitle(title);
  await page.waitForSelector('[data-testid="textFrame"]');
  await page.waitForSelector('[role="dialog"]');
}

describe('Font Check', () => {
  // TODO(#10916): Combine these calls.
  withExperimentalFeatures(['customFonts']);
  withExperimentalFeatures(['notifyDeletedFonts']);

  it('should show dialog & replace font with default font', async () => {
    const title = 'Test replace missing font with (default) Roboto';
    const replacementFont = 'Roboto';
    await storyWithFontCheckDialog(title);

    await takeSnapshot(page, 'Missing fonts dialog');

    await replaceFontUsingDefault(replacementFont);

    // Open the style tab.
    await expect(page).toClick('li[role="tab"]', { text: /^Style$/ });
    await expect(page).toMatchElement('button[aria-label="Font family"]', {
      text: replacementFont,
    });
  });

  it('should show dialog & replace it with selected font', async () => {
    const title = 'Test replace missing font with Bungee';
    const replacementFont = 'Bungee';
    await storyWithFontCheckDialog(title);
    await replaceFontWithFontPicker(replacementFont);

    // Open the style tab.
    await expect(page).toClick('li[role="tab"]', { text: /^Style$/ });
    await expect(page).toMatchElement('button[aria-label="Font family"]', {
      text: replacementFont,
    });
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

  it('should redirect to dashboard when clicking outside dialog', async () => {
    const title = 'Test back to dashboard from dialog';
    await storyWithFontCheckDialog(title);
    // click outside the dialog
    await Promise.all([
      await page.mouse.click(100, 100),
      page.waitForNavigation(),
    ]);
    await expect(page).toMatchElement('h2', { text: 'Dashboard' });
  });

  it('should redirect to dashboard when pressing ESC', async () => {
    const title = 'Test back to dashboard from dialog';
    await storyWithFontCheckDialog(title);
    await Promise.all([
      await page.keyboard.press('Escape'),
      page.waitForNavigation(),
    ]);
    await expect(page).toMatchElement('h2', { text: 'Dashboard' });
  });
});
