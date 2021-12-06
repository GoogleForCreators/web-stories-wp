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
import StoryEditor, {
  InterfaceSkeleton,
} from '@googleforcreators/story-editor';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { getDummyMedia } from './getDummyMedia';
import { HeaderLayout } from './header';

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

// @todo Should still work with empty object.
const story = {
  title: { raw: '' },
  excerpt: { raw: '' },
  permalink_template: 'https://example.org/web-stories/%pagename%/',
  style_presets: {
    color: [],
    textStyles: [],
  },
  date: '2021-10-26T12:38:38', // Publishing field breaks if date is not provided.
};

const apiCallbacks = apiCallbacksNames.reduce((callbacks, name) => {
  let response;

  switch (name) {
    case 'getCurrentUser':
      response = { id: 1 };
      break;
    case 'getPublisherLogos':
      response = [{ url: '' }];
      break;
    default:
      response = {};
  }

  if ('saveStoryById' === name) {
    callbacks[name] = (_story) => {
      window.localStorage.setItem('preview_markup', _story?.content);
      return Promise.resolve(story);
    };
  } else if ('getMedia' === name) {
    callbacks[name] = (params) => {
      const dummyMedia = getDummyMedia();
      const mediaResponse = {
        data: dummyMedia,
        headers: {
          totalItems: dummyMedia.length,
          totalPages: 1,
        },
      };

      if (params.searchTerm) {
        mediaResponse.data = dummyMedia.filter((media) => {
          return media.alt
            .toLowerCase()
            .includes(params.searchTerm.toLowerCase());
        });
        mediaResponse.headers.totalItems = mediaResponse.data.length;
      }

      return Promise.resolve(mediaResponse);
    };
  } else {
    callbacks[name] = () => Promise.resolve(response);
  }

  return callbacks;
}, {});

const config = {
  apiCallbacks,
};

export const _default = () => (
  <AppContainer>
    <StoryEditor config={config} initialEdits={{ story }}>
      <InterfaceSkeleton header={<HeaderLayout />} />
    </StoryEditor>
  </AppContainer>
);
