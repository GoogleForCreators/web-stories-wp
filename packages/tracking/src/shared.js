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
import { DATA_LAYER } from './constants';

/**
 * Pushes data onto the data layer.
 *
 * Must push an instance of Arguments to the target.
 * Using an ES6 spread operator (i.e. `...args`) will cause tracking events to _silently_ fail.
 */
export function gtag() {
  global[DATA_LAYER] = global[DATA_LAYER] || [];
  //eslint-disable-next-line prefer-rest-params
  global[DATA_LAYER].push(arguments);
}

const DEFAULT_CONFIG = {
  trackingAllowed: false,
  trackingEnabled: false,
  trackingId: '',
  trackingIdGA4: '',
  userProperties: {},
};

const {
  trackingAllowed,
  trackingId,
  trackingIdGA4,
  appVersion,
  userProperties,
} = global.webStoriesTrackingSettings || {};

export const config = {
  ...DEFAULT_CONFIG,
  trackingAllowed,
  trackingId,
  trackingIdGA4,
  appVersion,
  userProperties,
};
