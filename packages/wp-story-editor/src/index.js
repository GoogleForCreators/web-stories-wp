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
 * Internal dependencies
 */
// The __webpack_public_path__ assignment will be done after the imports.
// That's why the public path assignment is in its own dedicated module and imported here at the very top.
// See https://webpack.js.org/guides/public-path/#on-the-fly
import './publicPath';
import './style.css'; // This way the general editor styles are loaded before all the component styles.

// We need to load translations before any other imports happen.
// That's why this is in its own dedicated module imported here at the very top.
import './setLocaleData';

/**
 * External dependencies
 */
import StoryEditor from '@web-stories-wp/story-editor';
import { setAppElement, domReady } from '@web-stories-wp/design-system';
import { StrictMode, render } from '@web-stories-wp/react';
import { updateSettings } from '@web-stories-wp/date';
import { initializeTracking } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import {
  Layout,
  PostPublishDialog,
  StatusCheck,
  PostLock,
  MediaUpload,
} from './components';
import getApiCallbacks from './api/utils/getApiCallbacks';
import { transformGetStoryResponse } from './api/utils';

window.webStories = window.webStories || {};
window.webStories.domReady = domReady;

/**
 * Initializes the web stories editor.
 *
 * @param {string} id           ID of the root element to render the screen in.
 * @param {Object} config       Story editor settings.
 * @param {Object} initialEdits Initial edits.
 */
window.webStories.initializeStoryEditor = (id, config, initialEdits) => {
  const appElement = document.getElementById(id);

  // see http://reactcommunity.org/react-modal/accessibility/
  setAppElement(appElement);

  updateSettings(config.locale);

  initializeTracking('Editor');

  initialEdits.story = initialEdits.story
    ? transformGetStoryResponse(initialEdits.story)
    : null;

  const editorConfig = {
    ...config,
    apiCallbacks: getApiCallbacks(config),
    MediaUpload,
  };

  render(
    <StrictMode>
      <StoryEditor config={editorConfig} initialEdits={initialEdits}>
        <Layout />
        <PostPublishDialog />
        <StatusCheck />
        <PostLock />
      </StoryEditor>
    </StrictMode>,
    appElement
  );
};
