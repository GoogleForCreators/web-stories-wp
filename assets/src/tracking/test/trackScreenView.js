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

jest.mock('../shared');

/**
 * Internal dependencies
 */
import trackScreenView from '../trackScreenView';
import { config, gtag } from '../shared';

describe('trackScreenView', () => {
  afterEach(() => {
    config.trackingAllowed = false;
    config.trackingEnabled = false;
    config.appName = undefined;

    jest.clearAllMocks();
  });

  it('adds a tracking event to the dataLayer', async () => {
    config.appName = 'Foo App';
    config.trackingAllowed = true;
    config.trackingEnabled = true;
    config.siteUrl = 'https://www.example.com';
    config.userIdHash = 'a1b2c3';
    config.trackingId = 'UA-12345678-1';

    gtag.mockImplementationOnce((type, eventName, eventData) => {
      eventData.event_callback();
    });

    await trackScreenView('/my-awesome-screen');
    expect(gtag).toHaveBeenCalledWith('event', 'screen_view', {
      app_name: 'Foo App',
      event_callback: expect.any(Function),
      screen_name: '/my-awesome-screen',
    });
  });

  it('does not push to dataLayer when tracking is disabled', async () => {
    config.trackingEnabled = false;

    await trackScreenView('/my-awesome-screen');
    expect(gtag).not.toHaveBeenCalled();
  });
});
