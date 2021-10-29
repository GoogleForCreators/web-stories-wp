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
  storyId: 1,
  // When capabilities.canManageSettings is false, dashboardSettingsLink wouldn't be used.
  dashboardSettingsLink:
    'https://example.org/web-stories-dashboard#/editor-settings',
  // @todo WordPress specific page ( Must be optional ).
  generalSettingsLink: 'https://example.org/wp-admin/options-general.php',
  apiCallbacks, // @todo Should be optional.
  MediaUpload,
};

export const _default = () => (
  <AppContainer>
    <StoryEditor config={config}>
      <InterfaceSkeleton />
    </StoryEditor>
  </AppContainer>
);
