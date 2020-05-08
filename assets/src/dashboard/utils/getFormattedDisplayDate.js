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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import moment from 'moment';

export function isToday(momentString) {
  const today = moment().startOf('day');

  return momentString.isAfter(today);
}

export function isYesterday(momentString) {
  const yesterday = moment().subtract(1, 'days').date();

  return momentString.date() === yesterday;
}

export default function getFormattedDisplayDate(momentString) {
  if (isToday(momentString)) {
    return momentString.fromNow();
  } else if (isYesterday(momentString)) {
    return __('yesterday', 'web-stories');
  }
  return momentString.format('M/D/YYYY');
}
