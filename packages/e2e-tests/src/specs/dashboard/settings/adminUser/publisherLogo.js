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
  visitSettings,
  uploadPublisherLogo,
  withExperimentalFeatures,
  deleteAllMedia,
} from '@web-stories-wp/e2e-test-utils';

const ERROR_TEXT =
  'Sorry, this file type is not supported. Only jpg, png, and static gifs are supported for publisher logos.';

async function deleteAllPublisherLogos() {
  const publisherLogos = await page.$$(
    '[role="list"][aria-label="Viewing existing publisher logos"] [role="listitem"]'
  );
  // We can only delete all but one publisher logo.
  publisherLogos.shift();

  /* eslint-disable no-await-in-loop */
  for (const item of publisherLogos) {
    await item.hover();

    await expect(item).toClick('button[aria-label^="Publisher logo menu for"]');

    await expect(item).toClick('[aria-label="Menu"] button[role="menuitem"]', {
      text: 'Delete',
      visible: true,
    });

    await expect(page).toMatch('Setting saved.');
  }
  /* eslint-enable no-await-in-loop */
}

jest.retryTimes(2, { logErrorsBeforeRetry: true });

describe('Publisher Logos', () => {
  describe('Without SVG support', () => {
    beforeEach(async () => {
      await deleteAllMedia(); // Will also delete *all* publisher logos.
      await visitSettings();
      await uploadPublisherLogo('web-stories.png');
      await uploadPublisherLogo('wordpress-logo.png');
      await uploadPublisherLogo('google.png');
    });

    afterEach(async () => {
      await deleteAllPublisherLogos();
    });

    it('should update the default logo', async () => {
      const publisherLogos = await page.$$(
        '[role="list"][aria-label="Viewing existing publisher logos"] [role="listitem"]'
      );

      const initialDefault = publisherLogos[0];
      const logoToMakeDefault = publisherLogos[1];

      expect(initialDefault).toBeTruthy();
      await expect(initialDefault).toMatchElement('p', { text: 'Default' });

      expect(logoToMakeDefault).toBeTruthy();
      await expect(logoToMakeDefault).not.toMatchElement('p', {
        text: 'Default',
      });

      await expect(logoToMakeDefault).toClick(
        'button[aria-label^="Publisher logo menu for"]'
      );
      await expect(logoToMakeDefault).toMatchElement(
        '[aria-label="Menu"] button[role="menuitem"]',
        {
          text: 'Set as Default',
          visible: true,
        }
      );
      await expect(logoToMakeDefault).toClick(
        '[aria-label="Menu"] button[role="menuitem"]',
        {
          text: 'Set as Default',
          visible: true,
        }
      );

      await expect(page).toMatch('Setting saved.');

      const updatedPublisherLogos = await page.$$(
        '[role="list"][aria-label="Viewing existing publisher logos"] [role="listitem"]'
      );

      const oldDefault = updatedPublisherLogos[0];
      const newDefault = updatedPublisherLogos[1];

      expect(oldDefault).toBeTruthy();
      await expect(oldDefault).not.toMatchElement('p', { text: 'Default' });

      expect(newDefault).toBeTruthy();
      await expect(newDefault).toMatchElement('p', { text: 'Default' });
    });

    it('should update the default logo via keyboard', async () => {
      const publisherLogos = await page.$$(
        '[role="list"][aria-label="Viewing existing publisher logos"] [role="listitem"]'
      );

      // eslint-disable-next-line jest/no-conditional-in-test
      if (1 === (publisherLogos?.length || 0)) {
        throw new Error('Not enough publisher logos');
      }

      const initialDefault = await publisherLogos[0];
      expect(initialDefault).toBeTruthy();
      await expect(initialDefault).toMatchElement('p', { text: 'Default' });

      await page.focus('[aria-label="Viewing existing publisher logos"]');

      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');

      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await page.keyboard.press('Enter');

      await expect(page).toMatch('Setting saved.');

      const updatedPublisherLogos = await page.$$(
        '[role="list"][aria-label="Viewing existing publisher logos"] [role="listitem"]'
      );

      const oldDefault = updatedPublisherLogos[0];
      const newDefault = updatedPublisherLogos[1];

      expect(oldDefault).toBeTruthy();
      await expect(oldDefault).not.toMatchElement('p', { text: 'Default' });

      expect(newDefault).toBeTruthy();
      await expect(newDefault).toMatchElement('p', { text: 'Default' });
    });

    it('should remove a logo via keyboard', async () => {
      const publisherLogos = await page.$$(
        '[role="list"][aria-label="Viewing existing publisher logos"] [role="listitem"]'
      );

      // eslint-disable-next-line jest/no-conditional-in-test
      const initialPublisherLogosLength = publisherLogos.length || 0;

      // eslint-disable-next-line jest/no-conditional-in-test
      if (1 === initialPublisherLogosLength) {
        throw new Error('Not enough publisher logos');
      }

      await page.focus('[aria-label="Viewing existing publisher logos"]');

      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');

      await expect(page).toMatch('Setting saved.');

      const updatedPublisherLogos = await page.$$(
        '[role="list"][aria-label="Viewing existing publisher logos"] [role="listitem"]'
      );

      // eslint-disable-next-line jest/no-conditional-in-test
      const updatedPublisherLogosLength = updatedPublisherLogos.length || 0;

      expect(updatedPublisherLogosLength).toBe(initialPublisherLogosLength - 1);
    });

    it('should not be able to delete the last logo', async () => {
      await deleteAllPublisherLogos();

      const firstLogo = await page.$(
        '[role="list"][aria-label="Viewing existing publisher logos"] [role="listitem"]:nth-of-type(1)'
      );

      await firstLogo.hover();

      await expect(firstLogo).not.toMatchElement(
        'button[aria-label^="Publisher logo menu for"]'
      );
    });
  });

  describe('With SVG support', () => {
    withExperimentalFeatures(['enableSVG']);

    it('should not allow using an SVG as a publisher logo', async () => {
      await visitSettings();

      // Upload publisher logo
      await uploadPublisherLogo('video-play.svg', false);

      // verify error message
      await expect(page).toMatchElement('[role="alert"]', {
        text: ERROR_TEXT,
      });
    });
  });
});
