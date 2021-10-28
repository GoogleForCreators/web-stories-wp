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
import StoryEditor, { InterfaceSkeleton } from '@web-stories-wp/story-editor';

export default {
  title: 'Playground/Stories Editor',
};

const MediaUpload = ({ render }) => {
  return render(() => {});
};

// @todo None of these should be required by default.
const apiCallbacksNames = [
  'getAuthors',
  'getStoryById',
  'getDemoStoryById',
  'saveStoryById',
  'autoSaveById',
  'getMedia',
  'getMediaById',
  'getMutedMediaById',
  'getOptimizedMediaById',
  'uploadMedia',
  'updateMedia',
  'deleteMedia',
  'getLinkMetadata',
  'getCustomPageTemplates',
  'addPageTemplate',
  'deletePageTemplate',
  'getCurrentUser',
  'updateCurrentUser',
  'getHotlinkInfo',
  'getProxyUrl',
  'getPublisherLogos',
  'addPublisherLogo',
  'getTaxonomies',
  'getTaxonomyTerm',
  'createTaxonomyTerm',
];

const apiCallbacks = apiCallbacksNames.reduce((callbacks, name) => {
  let response;

  switch (name) {
    case 'getCurrentUser':
      response = { id: 1 };
      break;
    case 'getStoryById':
    case 'getDemoStoryById':
      response = {
        title: { raw: '' },
        excerpt: { raw: '' },
        permalink_template: 'https://example.org/web-stories/%pagename%/',
        style_presets: {
          color: [],
          textStyles: [],
        },
      };
      break;
    default:
      response = {};
  }

  callbacks[name] = () => Promise.resolve(response);
  return callbacks;
}, {});

// @todo Figure out what all keys should be optional.
const config = {
  autoSaveInterval: 60,
  isRTL: false,
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
  allowedTranscodableMimeTypes: [
    'video/3gpp',
    'video/3gpp2',
    'video/MP2T',
    'video/mp4',
    'video/mpeg',
    'video/ogg',
    'video/quicktime',
    'video/webm',
    'video/x-flv',
    'video/x-h261',
    'video/x-h263',
    'video/x-m4v',
    'video/x-matroska',
    'video/x-mjpeg',
    'video/x-ms-asf',
    'video/x-msvideo',
    'video/x-nut',
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
  postType: 'web-story',
  storyId: 1,
  dashboardLink:
    'https://example.org/wp-admin/edit.php?post_type=web-story&page=stories-dashboard',
  dashboardSettingsLink:
    'https://example.org/wp-admin/edit.php?post_type=web-story&page=stories-dashboard#/editor-settings',
  generalSettingsLink: 'https://example.org/wp-admin/options-general.php',
  cdnURL: 'https://wp.stories.google/static/main/',
  maxUpload: 314572800,
  isDemo: false,
  capabilities: {
    hasUploadMediaAction: true,
    canManageSettings: true,
  },
  api: {},
  metadata: {
    publisher: '',
  },
  version: '1.14.0-alpha.0',
  showMedia3p: true,
  encodeMarkup: true,
  ffmpegCoreUrl:
    'https://wp.stories.google/static/main/js/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
  apiCallbacks,
  MediaUpload,
};

export const _default = () => (
  <StoryEditor config={config}>
    <InterfaceSkeleton />
  </StoryEditor>
);
