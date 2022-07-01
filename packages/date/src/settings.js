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

export const DEFAULT_DATE_SETTINGS = {
  dateFormat: 'F j, Y',
  timeFormat: 'g:i a',
  gmtOffset: 0,
  timezone: '',
  weekStartsOn: 0,
};

let settings = {
  ...DEFAULT_DATE_SETTINGS,
};

/**
 * Reset date settings to their defaults.
 */
export function resetSettings() {
  settings = DEFAULT_DATE_SETTINGS;
}

/**
 * Update date settings.
 *
 * @param {Object} newSettings Date settings.
 */
export function updateSettings(newSettings) {
  settings = {
    ...settings,
    ...newSettings,
  };
}

/**
 * Returns the current date settings.
 *
 * @return {Object} Date settings.
 */
export function getSettings() {
  return settings;
}
