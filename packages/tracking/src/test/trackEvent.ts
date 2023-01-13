/*
 * Copyright 2021 Google LLC
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
import { config, ControlParams, gtag } from '../shared';

describe('trackEvent', () => {
  afterEach(() => {
    config.trackingAllowed = false;
    config.trackingEnabled = false;

    jest.clearAllMocks();
  });

  it('adds a tracking event to the dataLayer', async () => {
    config.trackingAllowed = true;
    config.trackingEnabled = true;

    jest.mocked(gtag).mockImplementationOnce((_type, _eventName, eventData) => {
      (eventData as ControlParams).event_callback?.();
    });

    await trackEvent('name', { name: 'abc', value: 'def', event_label: 'ghi' });
    expect(gtag).toHaveBeenCalledWith('event', 'name', {
      event_callback: expect.any(Function) as () => void,
      name: 'abc',
      value: 'def',
      event_label: 'ghi',
    });
  });

  it('does not push to dataLayer when tracking is disabled', async () => {
    config.trackingEnabled = false;

    await trackEvent('name', { name: 'abc', value: 'def', event_label: 'ghi' });
    expect(gtag).not.toHaveBeenCalled();
  });

  it('sends two different tracking events for backwards compatibility', async () => {
    config.trackingAllowed = true;
    config.trackingEnabled = true;
    config.trackingId = 'UA-12345678-1';
    config.trackingIdGA4 = 'G-ABC1234567';

    jest.mocked(gtag).mockImplementationOnce((_type, _eventName, eventData) => {
      (eventData as ControlParams).event_callback?.();
    });

    await trackEvent('name', {
      search_type: 'abc',
    });
    await trackEvent('name', {
      duration: 123,
    });
    await trackEvent('name', {
      title_length: 123,
    });
    await trackEvent('name', {
      unread_count: 123,
    });
    expect(gtag).toHaveBeenNthCalledWith(1, 'event', 'name', {
      event_callback: expect.any(Function) as () => void,
      event_label: 'abc',
      send_to: config.trackingId,
    });
    expect(gtag).toHaveBeenNthCalledWith(2, 'event', 'name', {
      event_callback: expect.any(Function) as () => void,
      search_type: 'abc',
      send_to: config.trackingIdGA4,
    });
    expect(gtag).toHaveBeenNthCalledWith(3, 'event', 'name', {
      event_callback: expect.any(Function) as () => void,
      value: 123,
      send_to: config.trackingId,
    });
    expect(gtag).toHaveBeenNthCalledWith(4, 'event', 'name', {
      event_callback: expect.any(Function) as () => void,
      duration: 123,
      send_to: config.trackingIdGA4,
    });
    expect(gtag).toHaveBeenNthCalledWith(5, 'event', 'name', {
      event_callback: expect.any(Function) as () => void,
      value: 123,
      send_to: config.trackingId,
    });
    expect(gtag).toHaveBeenNthCalledWith(6, 'event', 'name', {
      event_callback: expect.any(Function) as () => void,
      title_length: 123,
      send_to: config.trackingIdGA4,
    });
    expect(gtag).toHaveBeenNthCalledWith(7, 'event', 'name', {
      event_callback: expect.any(Function) as () => void,
      value: 123,
      send_to: config.trackingId,
    });
    expect(gtag).toHaveBeenNthCalledWith(8, 'event', 'name', {
      event_callback: expect.any(Function) as () => void,
      unread_count: 123,
      send_to: config.trackingIdGA4,
    });
  });
});
