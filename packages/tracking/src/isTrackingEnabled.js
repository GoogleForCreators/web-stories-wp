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
import { config } from './shared';
import enableTracking from './enableTracking';

/**
 * Determines whether tracking is enabled or not.
 *
 * @return {boolean} Whether tracking is enabled
 */
async function isTrackingEnabled() {
  await enableTracking();
  return Boolean(config.trackingEnabled);
}

export default isTrackingEnabled;
