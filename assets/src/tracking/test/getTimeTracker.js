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
import getTimeTracker from '../getTimeTracker';
import { config, gtag } from '../shared';

jest.mock('../shared');

jest
  .spyOn(performance, 'now')
  .mockImplementationOnce(() => 150)
  .mockImplementationOnce(() => 200);

describe('getTimeTracker', () => {
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
    config.trackingId = 'UA-12345678-1';

    gtag.mockImplementationOnce((type, eventName, eventData) => {
      eventData.event_callback();
    });

    const trackTime = getTimeTracker('load', 'Dependencies', 'CDN');
    await trackTime();

    expect(gtag).toHaveBeenCalledWith('event', 'timing_complete', {
      event_callback: expect.any(Function),
      event_category: 'Dependencies',
      event_label: 'CDN',
      name: 'load',
      value: 50,
    });
  });

  it('does not push to dataLayer when tracking is disabled', async () => {
    config.trackingEnabled = false;

    const trackTime = getTimeTracker('load', 'Dependencies', 'CDN');
    await trackTime();
    expect(gtag).not.toHaveBeenCalled();
  });
});
