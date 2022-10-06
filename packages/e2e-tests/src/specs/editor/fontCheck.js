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
  addRequestInterception,
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

async function createStoryWithFont(title, font = OPEN_SANS_CONDENSED_LIGHT) {
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

  await changeFont(font);

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

function isPlatformMacOS() {
  return page.evaluate(() => {
    const { platform } = window.navigator;
    return platform.includes('Mac') || ['iPad', 'iPhone'].includes(platform);
  });
}

async function toggleDevTools() {
  const areDevToolsOpen = Boolean(await page.$('#web-stories-editor textarea'));

  await page.screenshot({ path: `build/toggleDevTools-a.png` });

  // Cancel whatever current action to ensure the below shortcut works.
  await page.keyboard.press('Escape');
  await page.click('#wpadminbar');
  await page.click('[aria-label="Web Stories Editor"]');

  const isMacOS = await isPlatformMacOS();
  const Meta = isMacOS ? 'Meta' : 'Control';
  await page.keyboard.down(Meta);
  await page.keyboard.down('Shift');
  await page.keyboard.down('Alt');
  await page.keyboard.down('J');
  await page.keyboard.up('J');
  await page.keyboard.up('Alt');
  await page.keyboard.up('Shift');
  await page.keyboard.down(Meta);

  await page.screenshot({ path: `build/toggleDevTools-b.png` });

  // Dev Tools were not open before, but now they should be open.
  if (!areDevToolsOpen) {
    await page.waitForSelector('#web-stories-editor textarea');
  }
}

async function getCurrentStoryData() {
  await toggleDevTools();

  const textareaContent = await page.evaluate(
    () => document.querySelector('#web-stories-editor textarea').value
  );

  await toggleDevTools();

  return JSON.parse(textareaContent);
}

jest.retryTimes(2, { logErrorsBeforeRetry: true });

describe('Font Check', () => {
  beforeEach(async () => {
    await visitSettings();
    await removeAllFonts();
    await addCustomFont(OPEN_SANS_CONDENSED_LIGHT_URL);
  });

  afterAll(async () => {
    await page.screenshot({ path: `build/afterAll-a.png` });
    await visitSettings();
    await page.screenshot({ path: `build/afterAll-b.png` });
    await removeAllFonts();
    await page.screenshot({ path: `build/afterAll-c.png` });
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

  it('should receive updated font metrics and not alter history', async () => {
    const storyTitle = 'Font Check Metrics';
    await createStoryWithFont(storyTitle, 'Rock Salt');

    await page.screenshot({ path: `build/fontMetrics-0.png` });

    const storyData = await getCurrentStoryData();

    await page.screenshot({ path: `build/fontMetrics-1.png` });

    const fontBefore = storyData.pages[0].elements[1].font;
    expect(fontBefore.family).toBe('Rock Salt');
    expect(fontBefore.fallbacks).toIncludeAllMembers(['cursive']);
    expect(fontBefore.metrics.upm).toBe(1024);

    const mockResponse = {
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          family: 'Rock Salt',
          fallbacks: ['sans-serif'], // Original is "cursive"
          weights: [900],
          styles: ['italic'],
          variants: [[0, 400]],
          service: 'fonts.google.com',
          metrics: {
            upm: 200, // Original is 1024
            asc: 1623,
            des: -788,
            tAsc: 824,
            tDes: -240,
            tLGap: 63,
            wAsc: 1623,
            wDes: 788,
            xH: 833,
            capH: 1154,
            yMin: -787,
            yMax: 1623,
            hAsc: 1623,
            hDes: -788,
            lGap: 32,
          },
        },
      ]),
    };

    await page.setRequestInterception(true);
    const stopRequestInterception = addRequestInterception((request) => {
      // eslint-disable-next-line jest/no-conditional-in-test
      if (request.url().includes('web-stories/v1/fonts') && mockResponse) {
        request.respond(mockResponse);
        return;
      }

      request.continue();
    });

    await Promise.all([
      page.waitForResponse(
        (response) =>
          //eslint-disable-next-line jest/no-conditional-in-test -- False positive.
          response.url().includes('web-stories/v1/fonts') &&
          response.status() === 200
      ),
      page.reload(),
    ]);

    stopRequestInterception();
    await page.setRequestInterception(false);

    const newStoryData = await getCurrentStoryData();
    const fontAfter = newStoryData.pages[0].elements[1].font;
    expect(fontAfter.family).toBe('Rock Salt');
    expect(fontAfter.fallbacks).toIncludeAllMembers(['sans-serif']);
    expect(fontAfter.metrics.upm).toBe(200);

    await expect(page).toMatchElement(
      'button[aria-label="Undo Changes"]:disabled'
    );
    await expect(page).toMatchElement(
      'button[aria-label="Redo Changes"]:disabled'
    );
  });
});
