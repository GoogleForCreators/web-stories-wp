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
import Dashboard, { InterfaceSkeleton } from '@web-stories-wp/dashboard';
import styled from 'styled-components';
import { useRef } from 'react';
import { toId } from '@storybook/csf';

/**
 * Internal dependencies
 */
import { GlobalStyle } from './theme';

export default {
  title: 'Playground/Dashboard',
};

const AppContainer = styled.div`
  height: 100vh;
`;

const apiCallbacksNames = [
  'createStoryFromTemplate',
  'duplicateStory',
  'fetchStories',
  'getAuthors',
  'trashStory',
  'updateStory',
];

const linkHrefTo = (title, name) => {
  const url = new URL(window.parent.location);
  url.searchParams.set('path', '/story/' + toId(title, name));
  return decodeURIComponent(url.href);
};

const storyEditorLink = linkHrefTo('Playground/Stories Editor', 'default');

const fetchStoriesResp = {
  stories: {
    1: {
      id: 1,
      status: 'publish',
      title: 'Example story',
      created: '2021-11-04T10:12:47',
      createdGmt: '2021-11-04T10:12:47Z',
      author: {
        name: 'Author',
        id: 1,
      },
      featuredMediaUrl:
        'https://wp.stories.google/static/main/images/templates/food-and-stuff/page1_bg.jpg',
    },
    2: {
      id: 2,
      status: 'publish',
      title: 'Example story 2',
      created: '2021-12-04T10:12:47',
      createdGmt: '2021-12-04T10:12:47Z',
      author: {
        name: 'Author',
        id: 1,
      },
      featuredMediaUrl:
        'https://wp.stories.google/static/main/images/templates/fresh-and-bright/page8_figure.jpg',
    },
  },
  fetchedStoryIds: [1, 2],
  totalPages: 1,
  totalStoriesByStatus: {
    all: 2,
    publish: 2,
  },
};

// @todo Callbacks should be optional.
const apiCallbacks = apiCallbacksNames.reduce((callbacks, name) => {
  let response;

  switch (name) {
    case 'fetchStories':
      response = fetchStoriesResp;
      break;
    case 'getAuthors':
      response = [];
      break;
    default:
      response = {};
  }
  callbacks[name] = () => Promise.resolve(response);

  return callbacks;
}, {});

// @todo Cleanup config and use a default configuration inside core dashboard package.
const config = {
  userId: 1,
  flags: {
    enableSVG: false,
    enablePostLocking: false,
    archivePageCustomization: true,
    enableBetterCaptions: true,
    enableInProgressTemplateActions: false,
  },
  capabilities: {
    canManageSettings: true,
    canUploadFiles: true,
  },
  newStoryURL: storyEditorLink,
  api: {},
  apiCallbacks,
};

/**
 * Clears url hash ( Required only for storybook )
 * Dashboard uses # for checking route path and story-editor uses #page,
 * when returning from story-editor to dashboard in storybook, currentPath read from history package gets manipulated,
 * which breaks the current path, so this custom hook is used to clear the hash before dashboard app is mounted.
 */
const useClearHash = () => {
  const isHashCleaned = useRef(false);

  if (!isHashCleaned.current) {
    window.location.hash = '/';
    isHashCleaned.current = true;
  }
};

export const _default = () => {
  useClearHash();

  return (
    <AppContainer>
      <Dashboard config={config}>
        <GlobalStyle />
        <InterfaceSkeleton />
      </Dashboard>
    </AppContainer>
  );
};
