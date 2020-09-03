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
 * External dependencies
 */
import DateFormatter from 'php-date-formatter';

/** @typedef {import('moment').Moment} Moment */

/**
 * Internal dependencies
 */
import { getMoment } from './getMoment';
import { DEFAULT_DATE_SETTINGS } from './';

/**
 * Formats a date by dateSettings.dateFormat (no time).
 *
 * @param {Date|Moment} date Date to format.
 * @param {import('./').DateSettings} dateSettings Date settings.
 *
 * @return {string} Displayable relative date string
 */
export function formatDate(date, dateSettings = DEFAULT_DATE_SETTINGS) {
  if (!date) {
    return '';
  }

  const { dateFormat } = dateSettings;
  const displayDate = getMoment(date, dateSettings);

  const fmt = new DateFormatter();

  return fmt.formatDate(displayDate.toDate(), dateFormat);
}
