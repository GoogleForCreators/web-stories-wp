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
  allowedMimeTypes: {
    audio: ['audio/mpeg', 'audio/aac', 'audio/wav', 'audio/ogg'],
    image: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
    caption: ['text/vtt'],
    vector: ['image/svg+xml'],
    video: ['video/mp4', 'video/webm'],
  },
  isRTL: false,
  storyId: 1,
  cdnURL: 'https://wp.stories.google/static/main/',
  maxUpload: 314572800,
  capabilities: {
    hasUploadMediaAction: false,
    canManageSettings: false,
  },
  metadata: {
    publisher: '',
  },
  canViewDefaultTemplates: true,
  showMedia3p: true,
  encodeMarkup: true,
  ffmpegCoreUrl:
    'https://wp.stories.google/static/main/js/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
  apiCallbacks: {},
  MediaUpload: () => null,
  styleConstants: {
    topOffset: 0,
    leftOffset: 0,
  },
});

export default getDefaultConfig;
