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
import { StoryEditor } from '@googleforcreators/story-editor';
import { setAppElement } from '@googleforcreators/design-system';
import { StrictMode, render } from '@googleforcreators/react';
import { updateSettings } from '@googleforcreators/date';
import { initializeTracking } from '@googleforcreators/tracking';
import { bindToCallbacks } from '@web-stories-wp/wp-utils';
import { registerElementType } from '@googleforcreators/elements';
import { elementTypes } from '@googleforcreators/element-library';

/**
 * WordPress dependencies
 */
import '@wordpress/dom-ready'; // Just imported here so it's part of the bundle. Usage is in inline scripts.

/**
 * Internal dependencies
 */
import {
  Layout,
  PostPublishDialog,
  StatusCheck,
  CorsCheck,
  FontCheck,
  PostLock,
  MediaUpload,
} from './components';
import * as apiCallbacks from './api';
import { transformStoryResponse } from './api/utils';
import { TIPS, TOOLBAR_HEIGHT, MENU_WIDTH } from './constants';
import { GlobalStyle } from './theme.js';

window.webStories = window.webStories || {};

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

  elementTypes.forEach(registerElementType);

  initialEdits.story = initialEdits.story
    ? transformStoryResponse(initialEdits.story)
    : null;

  const editorConfig = {
    ...config,
    apiCallbacks: bindToCallbacks(apiCallbacks, config),
    additionalTips: TIPS,
    MediaUpload,
    styleConstants: {
      topOffset: TOOLBAR_HEIGHT,
      leftOffset: MENU_WIDTH,
    },
  };

  render(
    <StrictMode>
      <StoryEditor config={editorConfig} initialEdits={initialEdits}>
        <GlobalStyle />
        <Layout />
        <PostPublishDialog />
        <StatusCheck />
        <CorsCheck />
        <FontCheck />
        <PostLock />
      </StoryEditor>
    </StrictMode>,
    appElement
  );
};
