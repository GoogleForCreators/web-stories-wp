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
import { config } from '../shared';
import enableTracking from '../enableTracking';

// Disable reason: Not yet testable due to the Promise in loadTrackingScript().
//eslint-disable-next-line jest/no-disabled-tests
describe.skip('enableTracking', () => {
  afterEach(() => {
    config.trackingAllowed = undefined;
    config.trackingEnabled = undefined;
  });

  it('does nothing if tracking is not allowed', async () => {
    config.trackingAllowed = false;
    config.trackingEnabled = false;

    await enableTracking();
    expect(config.trackingEnabled).toStrictEqual(false);
  });

  it('enqueues tracking script if tracking is allowed', async () => {
    config.trackingAllowed = true;
    config.trackingEnabled = false;

    await enableTracking();

    expect(config.trackingEnabled).toStrictEqual(true);
    const result = document.querySelector(`script[data-web-stories-tracking]`);
    expect(result).not.toBeNull();
  });
});
