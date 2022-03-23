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
  visitSettings,
  addCustomFont,
  removeCustomFont,
  getFontList,
  getSelectedFont,
  takeSnapshot,
} from '@web-stories-wp/e2e-test-utils';

/**
 * Internal dependencies
 */
import { addAllowedErrorMessage } from '../../../../config/bootstrap.js';

const FONT_BASE_URL = `${process.env.WP_BASE_URL}/wp-content/e2e-assets`;
const OPEN_SANS_CONDENSED_LIGHT = 'Open Sans Condensed Light';
const OPEN_SANS_CONDENSED_LIGHT_URL = `${FONT_BASE_URL}/OpenSansCondensed-Light.ttf`;
const OPEN_SANS_CONDENSED_BOLD = 'Open Sans Condensed Bold';
const OPEN_SANS_CONDENSED_BOLD_URL = `${FONT_BASE_URL}/OpenSansCondensed-Bold.ttf`;
const OPEN_SANS_CONDENSED_LIGHT_ITALIC_URL = `${FONT_BASE_URL}/OpenSansCondensed-LightItalic.ttf`;

const findByUrl = (arr, val) => arr.find((o) => o.url === val);

const removeAllFonts = async () => {
  await visitSettings();
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

describe('Custom Fonts', () => {
  withExperimentalFeatures(['customFonts']);

  let removeResourceErrorMessage;

  beforeAll(() => {
    // Ignore resource failing to load. This is only present because of the REST API error.
    removeResourceErrorMessage = addAllowedErrorMessage(
      'Failed to load resource'
    );
  });

  afterAll(() => {
    removeResourceErrorMessage();
  });

  beforeEach(async () => {
    await visitSettings();
    await removeAllFonts();
  });

  afterEach(async () => {
    await visitSettings();
    await removeAllFonts();
  });

  it('should add a fonts and handle keyboard navigation', async () => {
    await addCustomFont(OPEN_SANS_CONDENSED_LIGHT_URL);
    await addCustomFont(OPEN_SANS_CONDENSED_BOLD_URL);
    await addCustomFont(OPEN_SANS_CONDENSED_LIGHT_ITALIC_URL);

    const fonts = await getFontList();
    const font1 = findByUrl(fonts, OPEN_SANS_CONDENSED_LIGHT_URL);
    expect(font1?.name).toStrictEqual(OPEN_SANS_CONDENSED_LIGHT);
    const font2 = findByUrl(fonts, OPEN_SANS_CONDENSED_BOLD_URL);
    expect(font2?.name).toStrictEqual(OPEN_SANS_CONDENSED_BOLD);

    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
    const selected = await getSelectedFont();
    expect(selected.name).toStrictEqual(OPEN_SANS_CONDENSED_LIGHT);

    const listbox = await page.$('[role="listbox"]');

    const ariaActiveDescendant = await page.evaluate((el) => {
      const id = el.getAttribute('aria-activedescendant');
      return document.getElementById(id).getAttribute('aria-selected');
    }, listbox);

    expect(ariaActiveDescendant).toBe('true');
    await page.keyboard.press('Tab');

    await expect(page).toMatchElement(
      `button[aria-label="Delete ${OPEN_SANS_CONDENSED_LIGHT}"]`
    );

    await takeSnapshot(page, 'Custom Fonts Settings');
  });

  it('should show error on trying add font twice', async () => {
    await addCustomFont(OPEN_SANS_CONDENSED_LIGHT_URL);
    await addCustomFont(OPEN_SANS_CONDENSED_LIGHT_URL);

    await expect(page).toMatch(
      'A font with this name Open Sans Condensed Light already exists.'
    );
  });
});
