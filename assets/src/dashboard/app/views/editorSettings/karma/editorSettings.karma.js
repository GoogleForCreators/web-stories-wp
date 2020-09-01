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
import { within } from '@testing-library/react';

/**
 * Internal dependencies
 */
import Fixture from '../../../../karma/fixture';
import useApi from '../../../api/useApi';

describe('Settings View', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ enableSettingsView: true });

    await fixture.render();

    await navigateToEditorSettings();
  });

  afterEach(() => {
    fixture.restore();
  });

  function navigateToEditorSettings() {
    const editorSettingsMenuItem = fixture.screen.queryByRole('link', {
      name: /^Editor Settings$/,
    });
    return fixture.events.click(editorSettingsMenuItem);
  }

  async function getSettingsState() {
    const {
      state: { settings },
    } = await fixture.renderHook(() => useApi());

    return settings;
  }

  it('should render', async () => {
    const settingsView = await fixture.screen.getByTestId('editor-settings');

    const PageHeading = within(settingsView).getByText('Settings');

    expect(PageHeading).toBeTruthy();
  });

  it('should update the tracking id', async () => {
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

    const newInput = await fixture.screen.getByRole('textbox');
    expect(newInput.value).toBe(googleAnalyticsId);
  });

  it("it should not allow an update of google analytics id when id format doesn't match required format", async () => {
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

  it('should remove a publisher logo on click', async () => {
    const settingsView = await fixture.screen.getByTestId('editor-settings');

    const PublisherLogos = within(settingsView).queryAllByTestId(
      /^publisher-logo/
    );
    const initialPublisherLogosLength = PublisherLogos.length;
    expect(PublisherLogos).toBeTruthy();

    const RemovePublisherLogoButton = within(settingsView).queryAllByTestId(
      /^remove-publisher-logo/
    )[0];

    expect(RemovePublisherLogoButton).toBeTruthy();

    await fixture.events.click(RemovePublisherLogoButton);

    const confirmRemoveButton = fixture.screen.getByRole('button', {
      name: /^Remove Logo$/,
    });

    await fixture.events.click(confirmRemoveButton);

    const UpdatedPublisherLogos = within(
      await fixture.screen.getByTestId('editor-settings')
    ).queryAllByTestId(/^publisher-logo/);

    expect(UpdatedPublisherLogos.length).toBe(initialPublisherLogosLength - 1);
  });

  it('should remove a publisher logo on keydown enter', async () => {
    const settingsView = await fixture.screen.getByTestId('editor-settings');

    const PublisherLogos = within(settingsView).queryAllByTestId(
      /^publisher-logo/
    );
    const initialPublisherLogosLength = PublisherLogos.length;
    expect(PublisherLogos).toBeTruthy();

    const RemovePublisherLogoButton = within(settingsView).queryAllByTestId(
      /^remove-publisher-logo/
    )[0];

    expect(RemovePublisherLogoButton).toBeTruthy();

    await fixture.events.focus(RemovePublisherLogoButton);
    await fixture.events.keyboard.press('Enter');

    const confirmRemoveButton = fixture.screen.getByRole('button', {
      name: /^Remove Logo$/,
    });

    await fixture.events.focus(confirmRemoveButton);
    await fixture.events.keyboard.press('Enter');

    const UpdatedPublisherLogos = within(
      await fixture.screen.getByTestId('editor-settings')
    ).queryAllByTestId(/^publisher-logo/);

    expect(UpdatedPublisherLogos.length).toBe(initialPublisherLogosLength - 1);
  });
});
