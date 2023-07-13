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
import isTrackingEnabled from './isTrackingEnabled';
import track from './track';

/**
 * Send an Analytics tracking event for exceptions.
 *
 * @see https://developers.google.com/analytics/devguides/collection/ga4/exceptions
 * @see https://developers.google.com/analytics/devguides/collection/gtagjs/exceptions
 * @param prefix Error prefixed. Concatenated with description.
 * @param description The error description.
 * @param [fatal] Report whether there is a fatal error.
 * @return Promise that always resolves.
 */
async function trackError(
  prefix: string,
  description: string,
  fatal = false
): Promise<void> {
  if (!(await isTrackingEnabled())) {
    return Promise.resolve();
  }

  const eventData = {
    description: `${prefix}: ${description}`,
    fatal,
  };

  return track('exception', eventData);
}

export default trackError;
