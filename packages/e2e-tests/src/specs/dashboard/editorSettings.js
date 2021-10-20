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
import { visitDashboard } from '@web-stories-wp/e2e-test-utils';

async function focusOnPublisherLogos(page) {
  // Wrong element in focus
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

const INPUT_SELECTOR = '[aria-label="Enter your Google Analytics Tracking ID"]';
const SETTINGS_SELECTOR = '[data-testid="editor-settings"]';

describe('Editor Settings View', () => {
  beforeEach(async () => {
    await visitDashboard();
    await page.click('[aria-label="Settings"] ');
  });

  afterEach(async () => {
    await page.evaluate(() => {
      window.location.hash = '#';
      localStorage.clear();
    });
  });

  it('should render', async () => {
    const settingsView = await page.$(SETTINGS_SELECTOR);
    expect(settingsView).toBeTruthy();

    await expect(page).toMatchElement('h2', { text: 'Settings' });
  });

  it('should update the tracking id when pressing Enter and display snackbar confirmation', async () => {
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

  it('should allow the analytics id to saved as an empty string and display snackbar confirmation', async () => {
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

    await expect(page).toClick('button', { text: 'Save' });

    await page.waitForTimeout(400);
    await expect(page).toMatch('Setting saved.');
  });

  it('should not allow an invalid analytics id to saved', async () => {
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
    await page.keyboard.type('INVALID');
    await expect(page).toClick('button', { text: 'Save' });

    await page.waitForTimeout(400);
    await expect(page).not.toMatch('Setting saved.');
    await expect(page).toMatch('Invalid ID format');
  });

  it("should not allow an update of google analytics id when id format doesn't match required format", async () => {
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
    await page.keyboard.type('Clearly not a valid id');
    await page.keyboard.press('Enter');

    await page.waitForTimeout(400);
    await expect(page).not.toMatch('Setting saved.');
    await expect(page).toMatch('Invalid ID format');
  });

  it('should update the default a publisher logo on click and display snackbar confirmation', async () => {
    // @todo: Add 2 logos first.
    const settingsView = await page.$(SETTINGS_SELECTOR);

    const publisherLogosContainerSelector =
      '[data-testid="publisher-logos-container"]';
    const publisherLogosContainer = await settingsView.$(
      publisherLogosContainerSelector
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

    const contextMenuButtonSelector =
      '[data-testid="publisher-logo-context-menu-button-1"]';

    const contextMenuButton = await publisherLogosContainer.$(
      contextMenuButtonSelector
    );
    expect(contextMenuButton).toBeTruthy();
    await expect(page).toClick(contextMenuButton);

    await page.waitForTimeout(300);

    await expect(logoToMakeDefault).toClick('span', { text: 'Set as Default' });

    await page.waitForTimeout(300);
    await expect(page).toMatch('Setting saved.');

    expect(initialDefault).toBeTruthy();
    expect(initialDefault).not.toMatchElement('p', { text: 'Default' });

    expect(logoToMakeDefault).toBeTruthy();
    expect(logoToMakeDefault).toMatchElement('p', { text: 'Default' });
  });

  it('should update the default logo on keydown and display snackbar confirmation', async () => {
    const settingsView = await page.$(SETTINGS_SELECTOR);

    const publisherLogosContainerSelector =
      '[data-testid="publisher-logos-container"]';
    const publisherLogosContainer = await settingsView.$(
      publisherLogosContainerSelector
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

    const publisherLogosContainerSelector =
      '[data-testid="publisher-logos-container"]';
    const publisherLogosContainer = await settingsView.$(
      publisherLogosContainerSelector
    );

    const publisherLogos = await publisherLogosContainer.$$(
      '[role="listitem"]'
    );
    const logoToDelete = publisherLogos[0];
    const initialPublisherLogosLength = publisherLogos.length;

    const contextMenuButtonSelector =
      '[data-testid="publisher-logo-context-menu-button-1"]';

    const contextMenuButton = await publisherLogosContainer.$(
      contextMenuButtonSelector
    );

    expect(contextMenuButton).toBeTruthy();
    await expect(page).toClick(contextMenuButtonSelector);

    await page.waitForTimeout(300);

    await expect(logoToDelete).toClick('span', { text: 'Delete' });

    await page.waitForTimeout(300);
    const updatedPublisherLogos = await publisherLogosContainer.$$(
      '[role="listitem"]'
    );

    await expect(page).toMatch('Setting saved.');

    const updatedPublisherLogosLength = updatedPublisherLogos.length;

    expect(updatedPublisherLogosLength).toBe(initialPublisherLogosLength - 1);
  });

  it('should remove a publisher logo on keydown enter and display snackbar confirmation', async () => {
    const settingsView = await page.$(SETTINGS_SELECTOR);

    const publisherLogosContainerSelector =
      '[data-testid="publisher-logos-container"]';
    const publisherLogosContainer = await settingsView.$(
      publisherLogosContainerSelector
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
  });

  it('should render the telemetry settings checkbox', async () => {
    const settingsView = await page.$('[data-testid="editor-settings"]');
    expect(settingsView).toBeTruthy();

    const TelemetrySettingsCheckbox = await page.$(
      '[data-testid="telemetry-settings-checkbox"]'
    );
    expect(TelemetrySettingsCheckbox).toBeTruthy();
  });

  it('should toggle the value and call the API provider when the tracking opt in box is clicked and display snackbar confirmation', async () => {
    const settingsView = await page.$('[data-testid="editor-settings"]');
    expect(settingsView).toBeTruthy();

    const telemetrySettingsCheckbox = await page.$(
      '[data-testid="telemetry-settings-checkbox"]'
    );
    expect(telemetrySettingsCheckbox).toBeTruthy();

    const checkboxStatus = await telemetrySettingsCheckbox.evaluate((el) => {
      return el.checked;
    });

    expect(checkboxStatus).toBeFalse();

    await expect(page).toClick('[data-testid="telemetry-settings-checkbox"]');

    const updatedCheckboxStatus = await telemetrySettingsCheckbox.evaluate(
      (el) => {
        return el.checked;
      }
    );

    expect(updatedCheckboxStatus).toBeTrue();
  });
});
