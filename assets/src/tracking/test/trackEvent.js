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
import trackEvent from '../trackEvent';
import { config, gtag } from '../shared';

describe('trackEvent', () => {
  afterEach(() => {
    config.trackingAllowed = false;
    config.trackingEnabled = false;

    jest.clearAllMocks();
  });

  it('adds a tracking event to the dataLayer', async () => {
    config.trackingAllowed = true;
    config.trackingEnabled = true;
    config.siteUrl = 'https://www.example.com';
    config.userIdHash = 'a1b2c3';
    config.trackingId = 'UA-12345678-1';

    gtag.mockImplementationOnce((type, eventName, eventData) => {
      eventData.event_callback();
    });

    await trackEvent('category', 'name', 'label', 'value');
    expect(gtag).toHaveBeenCalledWith('event', 'name', {
      dimension1: 'https://www.example.com',
      dimension2: 'a1b2c3',
      event_callback: expect.any(Function),
      event_category: 'category',
      event_label: 'label',
      event_value: 'value',
      send_to: 'UA-12345678-1',
    });
  });

  it('does not push to dataLayer when tracking is disabled', async () => {
    config.trackingEnabled = false;

    await trackEvent('test-category', 'test-name', 'test-label', 'test-value');
    expect(gtag).not.toHaveBeenCalled();
  });
});
