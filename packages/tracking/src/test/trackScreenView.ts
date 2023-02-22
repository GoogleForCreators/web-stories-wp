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
import trackScreenView from '../trackScreenView';
import { config, gtag } from '../shared';
import type { ControlParams } from '../shared';

describe('trackScreenView', () => {
  afterEach(() => {
    config.trackingAllowed = false;
    config.trackingEnabled = false;

    jest.clearAllMocks();
  });

  it('adds a tracking event to the dataLayer', async () => {
    config.trackingAllowed = true;
    config.trackingEnabled = true;

    jest.mocked(gtag).mockImplementation((_type, _eventName, eventData) => {
      (eventData as ControlParams).event_callback?.();
    });

    await trackScreenView('Explore Templates');
    expect(gtag).toHaveBeenCalledWith('event', 'screen_view', {
      event_callback: expect.any(Function) as () => void,
      screen_name: 'Explore Templates',
    });
  });

  it('does not push to dataLayer when tracking is disabled', async () => {
    config.trackingEnabled = false;

    await trackScreenView('Explore Templates');
    expect(gtag).not.toHaveBeenCalled();
  });
});
