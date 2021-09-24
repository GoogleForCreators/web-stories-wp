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
import { waitFor, within } from '@testing-library/react';

/**
 * Internal dependencies
 */
import Fixture from '../../../../karma/fixture';
import useApi from '../../../api/useApi';

describe('Settings View', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();

    await fixture.render();

    await navigateToEditorSettings();
  });

  afterEach(() => {
    fixture.restore();
  });

  async function focusOnPublisherLogos() {
    let limit = 0;
    const publisherLogosContainer = fixture.screen.getByTestId(
      'publisher-logos-container'
    );

    expect(publisherLogosContainer).toBeTruthy();
    await fixture.events.click(publisherLogosContainer);

    while (
      !publisherLogosContainer.contains(document.activeElement) &&
      limit < 10
    ) {
      // eslint-disable-next-line no-await-in-loop
      await fixture.events.keyboard.press('tab');
      limit++;
    }

    return publisherLogosContainer.contains(document.activeElement)
      ? Promise.resolve()
      : Promise.reject(new Error('could not focus on publisher logos'));
  }

  function navigateToEditorSettings() {
    const editorSettingsMenuItem = fixture.screen.queryByRole('link', {
      name: /^Settings$/,
    });
    return fixture.events.click(editorSettingsMenuItem);
  }

  async function getSettingsState() {
    const {
      state: { settings },
    } = await fixture.renderHook(() => useApi());

    return settings;
  }

  async function snackbarConfirmation() {
    await waitFor(
      () => {
        const alert = fixture.screen.getByRole('alert');
        expect(alert).toHaveTextContent('Setting saved.');
      },
      {
        timeout: 300,
      }
    );
  }

  it('should render', async () => {
    const settingsView = await fixture.screen.getByTestId('editor-settings');

    const PageHeading = within(settingsView).getByText('Settings');

    expect(PageHeading).toBeTruthy();
  });

  it('should update the tracking id when pressing Enter and display snackbar confirmation', async () => {
    const settingsView = await fixture.screen.getByTestId('editor-settings');

    const input = within(settingsView).getByRole('textbox');

    await fixture.events.hover(input);

    await fixture.events.click(input);

    const inputLength = input.value.length;

    for (let iter = 0; iter < inputLength; iter++) {
      // disable eslint to prevent overlapping .act calls
      // eslint-disable-next-line no-await-in-loop
      await fixture.events.keyboard.press('Backspace');
    }

    await fixture.events.keyboard.type('UA-009345-6');
    await fixture.events.keyboard.press('Enter');

    const { googleAnalyticsId } = await getSettingsState();

    expect(input.value).toBe(googleAnalyticsId);

    await snackbarConfirmation();
  });

  it('should update the tracking id by clicking the save button and display snackbar confirmation', async () => {
    const settingsView = await fixture.screen.getByTestId('editor-settings');

    const { getByRole } = within(settingsView);

    const input = getByRole('textbox');
    const button = getByRole('button', { name: /Save/ });

    await fixture.events.hover(input);

    await fixture.events.click(input);

    const inputLength = input.value.length;

    for (let iter = 0; iter < inputLength; iter++) {
      // disable eslint to prevent overlapping .act calls
      // eslint-disable-next-line no-await-in-loop
      await fixture.events.keyboard.press('Backspace');
    }

    await fixture.events.keyboard.type('UA-009345-6');
    await fixture.events.click(button);

    const { googleAnalyticsId } = await getSettingsState();

    expect(input.value).toBe(googleAnalyticsId);

    await snackbarConfirmation();
  });

  it('should allow the analytics id to saved as an empty string and display snackbar confirmation', async () => {
    const settingsView = await fixture.screen.getByTestId('editor-settings');
    const { googleAnalyticsId: initialId } = await getSettingsState();

    expect(initialId).not.toEqual('');

    const { getByRole } = within(settingsView);

    const input = getByRole('textbox');
    const button = getByRole('button', { name: /Save/ });

    await fixture.events.hover(input);

    await fixture.events.click(input);

    const inputLength = input.value.length;

    for (let iter = 0; iter < inputLength; iter++) {
      // disable eslint to prevent overlapping .act calls
      // eslint-disable-next-line no-await-in-loop
      await fixture.events.keyboard.press('Backspace');
    }

    await fixture.events.click(button);

    const { googleAnalyticsId: analyticsId } = await getSettingsState();

    expect(analyticsId).toEqual('');

    await snackbarConfirmation();
  });

  it('should not allow an invalid analytics id to saved', async () => {
    const settingsView = await fixture.screen.getByTestId('editor-settings');
    const { googleAnalyticsId: initialId } = await getSettingsState();

    expect(initialId).not.toEqual('');

    const { getByRole } = within(settingsView);

    const input = getByRole('textbox');
    const button = getByRole('button', { name: /Save/ });

    await fixture.events.hover(input);

    await fixture.events.click(input);

    const inputLength = input.value.length;

    for (let iter = 0; iter < inputLength; iter++) {
      // disable eslint to prevent overlapping .act calls
      // eslint-disable-next-line no-await-in-loop
      await fixture.events.keyboard.press('Backspace');
    }
    await fixture.events.keyboard.type('INVALID');
    await fixture.events.click(button);

    const { googleAnalyticsId: analyticsId } = await getSettingsState();

    expect(analyticsId).toEqual(initialId);
  });

  it("should not allow an update of google analytics id when id format doesn't match required format", async () => {
    const settingsView = await fixture.screen.getByTestId('editor-settings');

    const input = within(settingsView).getByRole('textbox');

    expect(input).toBeTruthy();

    await fixture.events.click(input);

    const inputLength = input.value.length;

    for (let iter = 0; iter < inputLength; iter++) {
      // disable eslint to prevent overlapping .act calls
      // eslint-disable-next-line no-await-in-loop
      await fixture.events.keyboard.press('Backspace');
    }

    await fixture.events.keyboard.type('Clearly not a valid id');
    await fixture.events.keyboard.press('Enter');

    const errorMessage = await fixture.screen.getByText('Invalid ID format');
    expect(errorMessage).toBeTruthy();
  });

  it('should update the default a publisher logo on click and display snackbar confirmation', async () => {
    const settingsView = await fixture.screen.getByTestId('editor-settings');

    const publisherLogosContainer = within(settingsView).getByTestId(
      'publisher-logos-container'
    );

    const InitialDefault = within(publisherLogosContainer).queryAllByRole(
      'listitem'
    )[0];
    const confirmInitialDefault = within(InitialDefault).getByText(/^Default/);
    expect(confirmInitialDefault).toBeTruthy();

    const LogoToMakeDefault = within(publisherLogosContainer).queryAllByRole(
      'listitem'
    )[1];
    const confirmCurrentlyNotDefault =
      within(LogoToMakeDefault).queryAllByText(/^Default/);
    expect(confirmCurrentlyNotDefault.length).toBe(0);

    const ContextMenuButton = within(publisherLogosContainer).getByTestId(
      'publisher-logo-context-menu-button-1'
    );
    expect(ContextMenuButton).toBeTruthy();

    await fixture.events.click(ContextMenuButton);

    const ContextMenu = within(settingsView).getByTestId(
      'publisher-logo-context-menu-1'
    );
    expect(ContextMenu).toBeDefined();

    const UpdateDefaultLogoButton =
      within(ContextMenu).getByText(/^Set as Default$/);

    expect(UpdateDefaultLogoButton).toBeTruthy();

    await fixture.events.click(UpdateDefaultLogoButton);

    const newPublisherLogosContainer = await fixture.screen.getByTestId(
      'publisher-logos-container'
    );

    const FormerDefaultLogo = within(newPublisherLogosContainer).queryAllByRole(
      'listitem'
    )[0];
    const confirmNotDefault =
      within(FormerDefaultLogo).queryAllByText(/^Default/);
    expect(confirmNotDefault.length).toBe(0);

    const NewLogoToMakeDefault = within(
      newPublisherLogosContainer
    ).queryAllByRole('listitem')[1];

    const confirmDefault = within(NewLogoToMakeDefault).getByText(/^Default/);
    expect(confirmDefault).toBeTruthy();

    await snackbarConfirmation();
  });

  it('should remove a publisher logo on click and display snackbar confirmation', async () => {
    const settingsView = await fixture.screen.getByTestId('editor-settings');

    const PublisherLogos = within(settingsView).queryAllByTestId(
      /^uploaded-publisher-logo-/
    );
    const initialPublisherLogosLength = PublisherLogos.length;
    expect(PublisherLogos).toBeTruthy();

    const ContextMenuButton = within(settingsView).getByTestId(
      'publisher-logo-context-menu-button-1'
    );
    expect(ContextMenuButton).toBeTruthy();

    await fixture.events.click(ContextMenuButton);

    const ContextMenu = within(settingsView).getByTestId(
      'publisher-logo-context-menu-1'
    );
    expect(ContextMenu).toBeDefined();

    const RemovePublisherLogoButton = within(ContextMenu).getByText('Delete');
    expect(RemovePublisherLogoButton).toBeTruthy();

    await fixture.events.click(RemovePublisherLogoButton);

    const UpdatedPublisherLogos = within(
      await fixture.screen.getByTestId('editor-settings')
    ).queryAllByTestId(/^uploaded-publisher-logo-/);

    expect(UpdatedPublisherLogos.length).toBe(initialPublisherLogosLength - 1);

    await snackbarConfirmation();
  });

  it('should remove a publisher logo on keydown enter and display snackbar confirmation', async () => {
    const settingsView = await fixture.screen.getByTestId(
      'publisher-logos-container'
    );

    const PublisherLogos = within(settingsView).queryAllByTestId(
      /^uploaded-publisher-logo-/
    );

    const initialPublisherLogosLength = PublisherLogos.length;
    expect(PublisherLogos).toBeTruthy();

    await focusOnPublisherLogos();

    const logo1 = fixture.screen.getByTestId(/^uploaded-publisher-logo-0/);
    await fixture.events.keyboard.press('right');
    expect(logo1).toEqual(document.activeElement);

    // go to second logo
    await fixture.events.keyboard.press('right');

    const logo2 = fixture.screen.getByTestId(/^uploaded-publisher-logo-1/);
    expect(logo2).toEqual(document.activeElement);

    await fixture.events.keyboard.press('Tab');

    await fixture.events.keyboard.press('Enter');

    // we want to select the second list item
    await fixture.events.keyboard.press('ArrowDown');

    await fixture.events.keyboard.press('Enter');

    const updatedLogos = within(
      await fixture.screen.getByTestId('publisher-logos-container')
    ).queryAllByTestId(/^uploaded-publisher-logo-/);

    expect(updatedLogos.length).toBeLessThan(initialPublisherLogosLength);

    await snackbarConfirmation();
  });

  it('should update the default logo on click and display snackbar confirmation', async () => {
    const settingsView = await fixture.screen.getByTestId('editor-settings');

    const PublisherLogos =
      within(settingsView).queryAllByTestId(/^publisher-logo-\d+$/);
    expect(PublisherLogos).toBeTruthy();

    // Check that the first publisher logo is set to the default
    const firstPublisherLogoIsDefault = Array.from(
      PublisherLogos[0].children
    ).find((node) => node.textContent === 'Default');
    expect(firstPublisherLogoIsDefault).toBeTruthy();

    const ContextMenuButtons = within(settingsView).queryAllByTestId(
      /^publisher-logo-context-menu-button-\d+$/
    );
    expect(ContextMenuButtons).toBeTruthy();

    await fixture.events.click(ContextMenuButtons[1]);

    const ContextMenu = within(settingsView).getByTestId(
      'publisher-logo-context-menu-1'
    );
    expect(ContextMenu).toBeDefined();

    const UpdateDefaultLogoButton =
      within(ContextMenu).getByText('Set as Default');
    expect(UpdateDefaultLogoButton).toBeTruthy();

    await fixture.events.click(UpdateDefaultLogoButton);

    const UpdatedPublisherLogos = within(
      await fixture.screen.getByTestId('editor-settings')
    ).queryAllByTestId(/^publisher-logo-\d+$/);

    // Check that the second publisher logo is set to the default
    const secondPublisherLogoIsDefault = Array.from(
      UpdatedPublisherLogos[1].children
    ).find((node) => node.textContent === 'Default');
    expect(secondPublisherLogoIsDefault).toBeTruthy();

    await snackbarConfirmation();
  });

  it('should update the default logo on keydown enter and display snackbar confirmation', async () => {
    const settingsView = await fixture.screen.getByTestId(
      'publisher-logos-container'
    );

    const PublisherLogos =
      within(settingsView).queryAllByTestId(/^publisher-logo-\d+$/);
    expect(PublisherLogos).toBeTruthy();

    // Check that the first publisher logo is set to the default
    const firstPublisherLogoIsDefault = Array.from(
      PublisherLogos[0].children
    ).find((node) => node.textContent === 'Default');

    expect(firstPublisherLogoIsDefault).toBeTruthy();

    await focusOnPublisherLogos();

    const logo1 = fixture.screen.getByTestId(/^uploaded-publisher-logo-0/);
    await fixture.events.keyboard.press('right');
    expect(logo1).toEqual(document.activeElement);

    // go right by 1
    await fixture.events.keyboard.press('right');

    const logo2 = fixture.screen.getByTestId(/^uploaded-publisher-logo-1/);
    expect(logo2).toEqual(document.activeElement);

    // set focus within logo2
    await fixture.events.keyboard.press('tab');

    // activate menu
    await fixture.events.keyboard.press('Enter');

    // we want to select the first list item
    await fixture.events.keyboard.press('Enter');

    const UpdatedPublisherLogos = within(
      await fixture.screen.getByTestId('publisher-logos-container')
    ).queryAllByTestId(/^publisher-logo-\d+/);

    // Check that the second publisher logo is set to the default
    const secondPublisherLogoIsDefault = Array.from(
      UpdatedPublisherLogos[1].children
    ).find((node) => node.textContent === 'Default');

    expect(secondPublisherLogoIsDefault).toBeTruthy();

    await snackbarConfirmation();
  });

  it('should render the telemetry settings checkbox', async () => {
    const settingsView = await fixture.screen.getByTestId('editor-settings');

    const TelemetrySettingsCheckbox = within(settingsView).queryAllByTestId(
      /^telemetry-settings-checkbox/
    );

    expect(TelemetrySettingsCheckbox).toBeTruthy();
  });

  it('should toggle the value and call the API provider when the tracking opt in box is clicked and display snackbar confirmation', async () => {
    const settingsView = await fixture.screen.getByTestId('editor-settings');

    const TelemetrySettingsCheckbox = within(settingsView).queryAllByTestId(
      /^telemetry-settings-checkbox/
    );

    expect(TelemetrySettingsCheckbox[0].checked).toBeTrue();

    await fixture.events.click(TelemetrySettingsCheckbox[0]);

    expect(TelemetrySettingsCheckbox[0].checked).toBeFalse();

    await snackbarConfirmation();
  });
});
