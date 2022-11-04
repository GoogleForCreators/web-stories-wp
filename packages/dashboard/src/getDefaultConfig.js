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
const getDefaultConfig = () => ({
  isRTL: false,
  userId: 1,
  locale: {
    locale: 'en-US',
    dateFormat: 'F j, Y',
    timeFormat: 'g:i a',
    gmtOffset: '0',
    timezone: '',
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    monthsShort: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    weekdays: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    weekdaysInitials: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    weekStartsOn: 1,
  },
  newStoryURL: '',
  // @todo Should we remove WP-specific props from here?
  archiveURL: '',
  // @todo Remove?
  defaultArchiveURL: '',
  cdnURL: 'https://wp.stories.google/static/main/',
  // @todo Remove?
  allowedImageMimeTypes: ['image/webp', 'image/png', 'image/jpeg', 'image/gif'],
  version: '',
  // @todo Remove?
  encodeMarkup: true,
  // @todo Remove?
  api: {},
  // @todo Remove?
  maxUpload: 314572800,
  // @todo Remove?
  maxUploadFormatted: '300 MB',
  capabilities: {
    canManageSettings: false,
    canUploadFiles: false,
  },
  canViewDefaultTemplates: false,
  // @todo Remove?
  localeData: [],
  flags: {},
  apiCallbacks: {},
  leftRailSecondaryNavigation: [],
  styleConstants: {
    topOffset: 0,
    leftOffset: 0,
  },
});

export default getDefaultConfig;
