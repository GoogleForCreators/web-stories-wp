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
  allowedFileTypes: [
    'gif',
    'jpe',
    'jpeg',
    'jpg',
    'm4v',
    'mp4',
    'png',
    'svg',
    'svgz',
    'webm',
    'webp',
  ],
  allowedImageFileTypes: ['gif', 'jpe', 'jpeg', 'jpg', 'png', 'webp'],
  allowedImageMimeTypes: ['image/webp', 'image/png', 'image/jpeg', 'image/gif'],
  allowedAudioFileTypes: ['aac', 'm4a', 'm4b', 'mp3', 'oga', 'ogg', 'wav'],
  allowedAudioMimeTypes: ['audio/mpeg', 'audio/aac', 'audio/wav', 'audio/ogg'],
  allowedMimeTypes: {
    image: [
      'image/webp',
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/svg+xml',
    ],
    audio: [],
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
