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

/**
 * Internal dependencies
 */
import { getMedia, saveStoryById } from './api';
import { HeaderLayout } from './header';
import { LOCAL_STORAGE_CONTENT_KEY } from './constants';

export default {
  title: 'Playground/Stories Editor',
};

const AppContainer = styled.div`
  height: 100vh;
`;

// @todo None of these should be required by default, https://github.com/google/web-stories-wp/pull/9569#discussion_r738458801
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
  switch (name) {
    case 'getCurrentUser':
      callbacks[name] = () => Promise.resolve({ id: 1 });
      break;
    case 'getPublisherLogos':
      callbacks[name] = () => Promise.resolve([{ url: '' }]);
      break;
    case 'saveStoryById':
      callbacks[name] = saveStoryById;
      break;
    case 'getMedia':
      callbacks[name] = getMedia;
      break;
    default:
      callbacks[name] = Promise.resolve({});
  }

  return callbacks;
}, {});

const getInitialStory = () => {
  const defaultStory = {
    title: { raw: '' },
    excerpt: { raw: '' },
    permalink_template: 'https://example.org/web-stories/%pagename%/',
    style_presets: {
      color: [],
      textStyles: [],
    },
    date: '2021-10-26T12:38:38', // Publishing field breaks if date is not provided.
  };

  const content = window.localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY);

  return content ? JSON.parse(content) : defaultStory;
};

export const _default = () => (
  <AppContainer>
    <StoryEditor
      config={{ apiCallbacks }}
      initialEdits={{ story: getInitialStory() }}
    >
      <InterfaceSkeleton header={<HeaderLayout />} />
    </StoryEditor>
  </AppContainer>
);
