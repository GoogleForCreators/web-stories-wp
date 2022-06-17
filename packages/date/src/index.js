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
 * @typedef {Object} DateSettings
 * @property {string} timezone - Indicates what the timezone to set the date
 * @property {number} gmtOffset - Indicates the offset to use to set the date
 * @property {string} dateFormat - Indicates the format the date should be displayed as
 * @property {string} timeFormat - Indicates the format the time should be displayed as} date
 * @param {*} dateSettings
 */

export {
  subMinutes,
  isValid,
  differenceInSeconds,
  differenceInDays,
  isAfter,
  compareDesc,
  compareAsc,
} from 'date-fns';
export { toDate } from 'date-fns-tz';

export { getSettings, updateSettings } from './settings';
export { default as format } from './format';
export { default as getRelativeDisplayDate } from './getRelativeDisplayDate';
export { default as formatDate } from './formatDate';
export { default as formatTime } from './formatTime';
export { default as toUTCDate } from './toUTCDate';
export { default as is12Hour } from './is12Hour';
export { default as weekStartsOn } from './weekStartsOn';
export { default as getOptions } from './getOptions';
