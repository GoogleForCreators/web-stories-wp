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
  await visitSettings();
  await addCustomFont(OPEN_SANS_CONDENSED_LIGHT_URL);
  await createStoryWithTitle(title);
  await updateFont(OPEN_SANS_CONDENSED_LIGHT);
  await publishStory();
  await visitSettings();
  await removeCustomFont(OPEN_SANS_CONDENSED_LIGHT);
  await editStoryWithTitle(title);
  await page.waitForSelector('[data-testid="textFrame"]');
  await page.waitForSelector('[role="dialog"]');
}

// eslint-disable-next-line jest/no-disabled-tests -- TODO(#11361): Fix flakey tests
describe.skip('Font Check', () => {
  beforeAll(async () => {
    await visitSettings();
    await removeAllFonts();
  });

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

    // Switch tabs to avoid an aXe issue, see https://github.com/GoogleForCreators/web-stories-wp/issues/11028.
    await expect(page).toClick('li[role="tab"]', { text: /^Insert$/ });
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

    // Switch tabs to avoid an aXe issue, see https://github.com/GoogleForCreators/web-stories-wp/issues/11028.
    await expect(page).toClick('li[role="tab"]', { text: /^Insert$/ });
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
