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
  deleteMedia,
} from '@web-stories-wp/e2e-test-utils';

const SETTINGS_SELECTOR = '[data-testid="editor-settings"]';
const PUBLISHER_LOGOS_CONTAINER_SELECTOR =
  '[data-testid="publisher-logos-container"]';
const CONTEXT_MENU_BUTTON_SELECTOR =
  '[data-testid="publisher-logo-context-menu-button-1"]';
const ERROR_TEXT =
  'Sorry, this file type is not supported. Only jpg, png, and static gifs are supported for publisher logos.';

async function focusOnPublisherLogos(page) {
  //wrong element in focus
  let limit = 0;
  let publisherLogosContainerFocusFlag = false;

  while (!publisherLogosContainerFocusFlag && limit < 10) {
    // eslint-disable-next-line no-await-in-loop
    await page.keyboard.press('Tab');
    // eslint-disable-next-line no-await-in-loop
    publisherLogosContainerFocusFlag = await page.evaluate(() => {
      const ele = document.querySelector(
        '[aria-label="Viewing existing publisher logos"]'
      );
      return document.activeElement === ele;
    });

    limit++;
  }

  return publisherLogosContainerFocusFlag
    ? Promise.resolve()
    : Promise.reject(new Error('could not focus on publisher logos'));
}

describe('Publisher Logo without SVG option enabled', () => {
  beforeAll(async () => {
    await visitSettings();
    await uploadPublisherLogo('yay-fox.gif');
    await uploadPublisherLogo('its-a-walk-off.gif');
  });

  beforeEach(async () => {
    await visitSettings();
  });

  it('should update the default a publisher logo on click and display snackbar confirmation', async () => {
    const settingsView = await page.$(SETTINGS_SELECTOR);
    const publisherLogosContainer = await settingsView.$(
      PUBLISHER_LOGOS_CONTAINER_SELECTOR
    );
    const publisherLogos = await publisherLogosContainer.$$(
      '[role="listitem"]'
    );
    const initialDefault = publisherLogos[0];

    expect(initialDefault).toBeTruthy();
    expect(initialDefault).toMatchElement('p', { text: 'Default' });

    const logoToMakeDefault = publisherLogos[1];

    expect(logoToMakeDefault).toBeTruthy();
    expect(logoToMakeDefault).not.toMatchElement('p', { text: 'Default' });

    await expect(page).toClick(CONTEXT_MENU_BUTTON_SELECTOR);

    await page.waitForTimeout(300);

    await expect(logoToMakeDefault).toClick('button', {
      text: 'Set as Default',
    });

    await page.waitForTimeout(300);
    await expect(page).toMatch('Setting saved.');

    expect(initialDefault).toBeTruthy();
    expect(initialDefault).not.toMatchElement('p', { text: 'Default' });

    expect(logoToMakeDefault).toBeTruthy();
    expect(logoToMakeDefault).toMatchElement('p', { text: 'Default' });
  });

  it('should update the default logo on keydown and display snackbar confirmation', async () => {
    const settingsView = await page.$(SETTINGS_SELECTOR);
    const publisherLogosContainer = await settingsView.$(
      PUBLISHER_LOGOS_CONTAINER_SELECTOR
    );
    const publisherLogos = await publisherLogosContainer.$$(
      '[role="listitem"]'
    );
    const initialDefault = publisherLogos[0];
    expect(initialDefault).toBeTruthy();
    expect(initialDefault).toMatchElement('p', { text: 'Default' });

    await focusOnPublisherLogos(page);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');

    await page.waitForTimeout(300);

    const updatedPublisherLogos = await publisherLogosContainer.$$(
      '[role="listitem"]'
    );
    const currentDefault = updatedPublisherLogos[1];
    expect(currentDefault).toBeTruthy();
    expect(currentDefault).toMatchElement('p', { text: 'Default' });

    await expect(page).toMatch('Setting saved.');
  });

  it('should remove a publisher logo on click and display snackbar confirmation', async () => {
    const settingsView = await page.$(SETTINGS_SELECTOR);

    const publisherLogosContainer = await settingsView.$(
      PUBLISHER_LOGOS_CONTAINER_SELECTOR
    );

    const publisherLogos = await publisherLogosContainer.$$(
      '[role="listitem"]'
    );
    const logoToDelete = publisherLogos[1];
    const initialPublisherLogosLength = publisherLogos.length;

    await expect(page).toClick(CONTEXT_MENU_BUTTON_SELECTOR);

    await page.waitForTimeout(300);

    await expect(logoToDelete).toClick('button', { text: 'Delete' });

    await page.waitForTimeout(300);
    const updatedPublisherLogos = await publisherLogosContainer.$$(
      '[role="listitem"]'
    );

    await expect(page).toMatch('Setting saved.');

    const updatedPublisherLogosLength = updatedPublisherLogos.length;

    expect(updatedPublisherLogosLength).toBe(initialPublisherLogosLength - 1);
    await uploadPublisherLogo('its-a-walk-off.gif');
  });

  it('should remove a publisher logo on keydown enter and display snackbar confirmation', async () => {
    const settingsView = await page.$(SETTINGS_SELECTOR);

    const publisherLogosContainer = await settingsView.$(
      PUBLISHER_LOGOS_CONTAINER_SELECTOR
    );

    expect(publisherLogosContainer).toBeTruthy();

    const publisherLogos = await publisherLogosContainer.$$(
      '[role="listitem"]'
    );
    const initialPublisherLogosLength = publisherLogos.length;

    await focusOnPublisherLogos(page);
    await page.keyboard.press('ArrowRight');

    const dataId0 = await page.evaluate(() =>
      document.activeElement.getAttribute('data-testid')
    );
    expect(dataId0).toBe('uploaded-publisher-logo-0');

    await page.keyboard.press('ArrowRight');

    const dataId1 = await page.evaluate(() =>
      document.activeElement.getAttribute('data-testid')
    );
    expect(dataId1).toBe('uploaded-publisher-logo-1');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.keyboard.press('ArrowDown');

    await page.keyboard.press('Enter');

    await page.waitForTimeout(300);

    const updatedPublisherLogos = await publisherLogosContainer.$$(
      '[role="listitem"]'
    );
    const updatedPublisherLogosLength = updatedPublisherLogos.length;

    expect(updatedPublisherLogosLength).toBe(initialPublisherLogosLength - 1);

    await page.waitForTimeout(300);

    await expect(page).toMatch('Setting saved.');
    await uploadPublisherLogo('its-a-walk-off.gif');
  });
});

describe('Publisher logo with SVG option enabled', () => {
  withExperimentalFeatures(['enableSVG']);

  let uploadedFiles;

  beforeEach(() => (uploadedFiles = []));

  afterEach(async () => {
    for (const file of uploadedFiles) {
      // eslint-disable-next-line no-await-in-loop
      await deleteMedia(file);
    }
  });

  it('should not upload a logo that is an invalid type with svg enabled', async () => {
    await visitSettings();

    // Upload publisher logo
    await uploadPublisherLogo('video-play.svg', false);

    // verify error message
    await expect(page).toMatchElement('[role="alert"]', {
      text: ERROR_TEXT,
    });
  });

  it('should be able to upload multiple logos', async () => {
    await visitSettings();

    // Upload publisher logo
    const logoOneName = await uploadPublisherLogo('yay-fox.gif');
    // verify no error message
    await expect(page).not.toMatchElement('[role="alert"]', {
      text: ERROR_TEXT,
    });

    const logoTwoName = await uploadPublisherLogo('its-a-walk-off.gif');
    // verify no error message
    await expect(page).not.toMatchElement('[role="alert"]', {
      text: ERROR_TEXT,
    });

    uploadedFiles.push(logoOneName);
    uploadedFiles.push(logoTwoName);
  });

  // TODO(#9152): Fix flakey test.
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should be able to delete all except one logo', async () => {
    await visitSettings();

    // Upload publisher logo
    const logoOneName = await uploadPublisherLogo('yay-fox.gif');
    // verify no error message
    await expect(page).not.toMatchElement('[role="alert"]', {
      text: ERROR_TEXT,
    });

    const logoTwoName = await uploadPublisherLogo('its-a-walk-off.gif');
    // verify no error message
    await expect(page).not.toMatchElement('[role="alert"]', {
      text: ERROR_TEXT,
    });

    // Delete the second logo
    await expect(page).toClick(
      `button[aria-label^="Publisher logo menu for ${logoTwoName}"`
    );
    await expect(page).toClick(
      '[data-testid="publisher-logo-1"] [data-testid="context-menu-list"] button',
      {
        text: 'Delete',
      }
    );
    await expect(page).toClick('button', { text: 'Delete Logo' });

    // should not find a button if its the last context menu
    await expect(page).not.toMatchElement(
      `button[aria-label^="Publisher logo menu for ${logoOneName}"`
    );

    uploadedFiles.push(logoOneName);
    uploadedFiles.push(logoTwoName);
  });
});
