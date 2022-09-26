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

interface ConfigParams {
  anonymize_ip?: boolean;
  app_name?: string;
  app_version?: string;
  send_page_view?: boolean;
  transport_type?: 'beacon' | 'image' | 'xhr';
  page_title?: string;
  page_path?: string;
  custom_map?: Record<string, string | number>;
}

interface ControlParams {
  groups?: string | string[] | undefined;
  send_to?: string | string[] | undefined;
  event_callback?: (() => void) | undefined;
  event_timeout?: number | undefined;
}

export interface EventParameters {
  name?: string;
  value?: string | number;
  send_to?: string | number;
  search_type?: string;
  duration?: number;
  title_length?: number;
  unread_count?: number;
  event_label?: string;
  event_category?: string;
}

interface Gtag {
  (command: 'config', targetId: string, config?: ConfigParams): void;
  (command: 'set', targetId: string, config: ConfigParams): void;
  (command: 'set', config: ConfigParams): void;
  (command: 'js', config: Date): void;
  (
    command: 'event',
    eventName: string,
    eventParams?: ControlParams | EventParameters
  ): void;
}

interface TrackingConfig {
  /**
   * Whether tracking is allowed in the current context.
   *
   * @default false
   */
  trackingAllowed?: boolean;
  /**
   * Whether tracking is currently enabled.
   *
   * @default false
   */
  trackingEnabled?: boolean;
  /**
   * Tracking ID.
   */
  trackingId: string;
  /**
   * GA4 tracking ID.
   */
  trackingIdGA4: string;
  /**
   * Application name.
   */
  appName: string;
  /**
   * Application version.
   */
  appVersion: string;
  /**
   * User properties.
   */
  userProperties: Record<string, string | number>;
}

declare global {
  interface Window {
    [DATA_LAYER]: object[];
    webStoriesTrackingSettings: TrackingConfig;
  }
}

/**
 * Pushes data onto the data layer.
 *
 * MUST push an instance of Arguments to the target.
 * Using an ES6 spread operator (i.e. `...args`) will cause tracking events to _silently_ fail.
 *
 * @see https://developers.google.com/tag-platform/devguides/datalayer#rename_the_data_layer
 */
export const gtag: Gtag = function (): void {
  window[DATA_LAYER] = window[DATA_LAYER] || [];
  //eslint-disable-next-line prefer-rest-params -- Must push instead of using spread to prevent tracking failures.
  window[DATA_LAYER].push(arguments);
};

const DEFAULT_CONFIG = {
  trackingAllowed: false,
  trackingEnabled: false,
  trackingId: '',
  trackingIdGA4: '',
  userProperties: {},
  appName: '',
};

const {
  trackingAllowed,
  trackingId,
  trackingIdGA4,
  appVersion,
  userProperties,
} = window.webStoriesTrackingSettings || {};

export const config: TrackingConfig = {
  ...DEFAULT_CONFIG,
  trackingAllowed,
  trackingId,
  trackingIdGA4,
  appVersion,
  userProperties,
};
