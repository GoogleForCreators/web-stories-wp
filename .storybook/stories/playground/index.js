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
import styled from 'styled-components';

export default {
  title: 'Playground/Stories Editor',
};

// @todo Instead of 100vh, may be the story editor should define its minimum required height to work properly,
// and that height should be set with the <StoryEditor> component.
const AppContainer = styled.div`
  height: 100vh;
`;

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
        date: '2021-10-26T12:38:38', // Publishing field breaks if date is not provided.
      };
      break;
    case 'getPublisherLogos':
      response = [{ url: '' }];
      break;
    default:
      response = {};
  }

  callbacks[name] = () => Promise.resolve(response);
  return callbacks;
}, {});

const config = {
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
  storyId: 1,
  // When capabilities.canManageSettings is false, dashboardSettingsLink wouldn't be used.
  dashboardSettingsLink:
    'https://example.org/web-stories-dashboard#/editor-settings',
  // @todo WordPress specific page ( Must be optional ).
  generalSettingsLink: 'https://example.org/wp-admin/options-general.php',
  cdnURL: 'https://wp.stories.google/static/main/',
  maxUpload: 314572800,
  capabilities: {
    hasUploadMediaAction: false,
    canManageSettings: false,
  },
  metadata: {
    publisher: '',
  },
  showMedia3p: true,
  encodeMarkup: true,
  ffmpegCoreUrl:
    'https://wp.stories.google/static/main/js/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
  apiCallbacks, // @todo Should be optional.
  MediaUpload, // @todo Should be optional.
};

export const _default = () => (
  <AppContainer>
    <StoryEditor config={config}>
      <InterfaceSkeleton />
    </StoryEditor>
  </AppContainer>
);
