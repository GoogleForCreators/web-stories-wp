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

function parseText(optionsText) {
  return optionsText.map((option) => {
    const [name, url] = option.split('\n');
    return { name, url };
  });
}

export const removeAllFonts = async () => {
  const fonts = await getFontList();

  if (fonts.length === 0) {
    return;
  }

  for (let i = 0; i < fonts.length; i++) {
    // eslint-disable-next-line no-await-in-loop -- Can't be done in parallel because of the confirmation dialog.
    await removeCustomFont(fonts[i].name);
  }

  const fontsAfter = await getFontList();
  await expect(fontsAfter).toHaveLength(0);
};

/**
 * @typedef {Object} FontData font data parsed from custom font listbox
 * @property {string} name font family name.
 * @property {string} url url for font.
 */

/**
 * Get array of fonts that have been added
 *
 * @return {Promise<[FontData]>} Fonts list.
 */
export const getFontList = async () => {
  try {
    const optionsText = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          'div[role=listbox] [role=option] div:first-child'
        ),
        (element) => element.innerText
      )
    );
    return parseText(optionsText);
  } catch (e) {
    return [];
  }
};

/**
 * Add a custom font on the settings page.
 *
 * @param {string} fontUrl Font URL.
 * @return {Promise<void>}
 */
export const addCustomFont = async (fontUrl) => {
  await expect(page).toMatch('Custom Fonts');

  await expect(page).toClick('label', {
    text: 'Insert Font URL',
  });

  await page.keyboard.type(fontUrl);
  await expect(page).toClick('button', { text: 'Add Font' });
  await expect(page).toMatch(fontUrl);
};

/**
 * Remove a custom font from the settings page.
 *
 * @param {string} fontName fontName to delete
 * @return {Promise<void>}
 */
export const removeCustomFont = async (fontName) => {
  const numberOfFonts = await page.evaluate(() => {
    return document.querySelector('div[role=listbox]')?.children?.length || 0;
  });

  const selector = `[aria-label="Delete ${fontName}"]`;
  await page.waitForSelector(selector);
  await page.focus(selector);
  await page.click(selector);
  await page.waitForSelector('[role="dialog"]');
  await expect(page).toClick('button', { text: 'Delete Font' });
  await page.waitForFunction(
    (expectedNumberOfFonts) => {
      const count =
        document.querySelector('div[role=listbox]')?.children?.length || 0;
      return count === expectedNumberOfFonts;
    },
    {},
    numberOfFonts - 1
  );
};
