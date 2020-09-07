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
 * Internal dependencies
 */
import Fixture from '../../../../karma/fixture';
import useApi from '../../../api/useApi';

describe('Telemetry Banner', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ enableSettingsView: true });

    await fixture.render();

    // Set the initial value of optIn to be false (it's default is true in the api fixture)
    const { toggleWebStoriesTrackingOptIn } = await fixture.renderHook(() =>
      useApi(
        ({
          actions: {
            usersApi: { toggleWebStoriesTrackingOptIn },
          },
        }) => ({ toggleWebStoriesTrackingOptIn })
      )
    );

    await fixture.act(() => toggleWebStoriesTrackingOptIn());
  });

  afterEach(() => {
    fixture.restore();

    localStorage.clear();
  });

  it('should render the telemetry opt in banner', async () => {
    const bannerHeader = await fixture.screen.getByText(
      /Help improve the editor!/
    );

    expect(bannerHeader).toBeTruthy();
  });

  it('should close the banner when the exit button is closed', async () => {
    const exitButton = await fixture.screen.getByRole('button', {
      name: /Close Telemetry Banner/,
    });

    await fixture.events.click(exitButton);

    const bannerHeader = await fixture.screen.queryByText(
      /Help improve the editor!/
    );

    expect(bannerHeader).toBeNull();
  });

  it('should enable telemetry tracking and close the banner when the checkbox is clicked', async () => {
    let optedIn = await fixture.renderHook(() =>
      useApi(
        ({ state: { currentUser } }) =>
          currentUser.data?.meta?.web_stories_tracking_optin ?? false
      )
    );

    expect(optedIn).toBeFalse();

    const checkbox = await fixture.querySelector('#telemetry-banner-opt-in');

    expect(checkbox).toBeTruthy();

    await fixture.events.click(checkbox);

    const bannerHeader = await fixture.screen.queryByText(
      /Help improve the editor!/
    );

    expect(bannerHeader).toBeNull();

    optedIn = await fixture.renderHook(() =>
      useApi(
        ({ state: { currentUser } }) =>
          currentUser.data?.meta?.web_stories_tracking_optin ?? false
      )
    );

    expect(optedIn).toBeTrue();
  });

  it('should not display the banner after it has been interacted with', async () => {
    const checkbox = await fixture.querySelector('#telemetry-banner-opt-in');

    expect(checkbox).toBeTruthy();

    await fixture.events.click(checkbox);

    let bannerHeader = await fixture.screen.queryByText(
      /Help improve the editor!/
    );

    expect(bannerHeader).toBeNull();

    await fixture.render();

    bannerHeader = await fixture.screen.queryByText(/Help improve the editor!/);

    expect(bannerHeader).toBeNull();
  });
});
