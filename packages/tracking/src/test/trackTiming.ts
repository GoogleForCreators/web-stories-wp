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

/**
 * Internal dependencies
 */
import trackTiming from '../trackTiming';
import { config } from '../shared';
import trackEvent from '../trackEvent';

jest.mock('../trackEvent');

jest
  .spyOn(performance, 'now')
  .mockImplementationOnce(() => 150)
  .mockImplementationOnce(() => 200);

describe('trackTiming', () => {
  afterEach(() => {
    config.trackingAllowed = false;
    config.trackingEnabled = false;
    config.appName = '';

    jest.clearAllMocks();
  });

  it('sends two separate tracking events', () => {
    config.appName = 'Foo App';
    config.trackingAllowed = true;
    config.trackingEnabled = true;
    config.trackingIdGA4 = 'G-ABC1234567';

    trackTiming('page', 50, 'carousel_navigate', 'click');

    expect(trackEvent).toHaveBeenCalledOnce();
    expect(trackEvent).toHaveBeenNthCalledWith(1, 'click', {
      event_category: 'page',
      event_label: 'carousel_navigate',
      value: 50,
    });
  });
});
