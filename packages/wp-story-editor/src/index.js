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

/**
 * External dependencies
 */
import StoryEditor from '@web-stories-wp/story-editor';
import { setAppElement } from '@web-stories-wp/design-system';
import { StrictMode, render } from '@web-stories-wp/react';
import { FlagsProvider } from 'flagged';
import { updateSettings } from '@web-stories-wp/date';
import { initializeTracking } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import * as apiCallbacks from './api';
import { PostPublishDialog, StatusCheck, PostLock } from './components';

/**
 * Initializes the web stories editor.
 *
 * @param {string} id       ID of the root element to render the screen in.
 * @param {Object} config   Story editor settings.
 * @param {Object} flags    The flags for the application.
 */
const initialize = (id, config, flags) => {
  const appElement = document.getElementById(id);

  // see http://reactcommunity.org/react-modal/accessibility/
  setAppElement(appElement);

  updateSettings(config.locale);

  initializeTracking('Editor');

  const editorConfig = {
    ...config,
    apiCallbacks,
  };

  render(
    <FlagsProvider features={flags}>
      <StrictMode>
        <StoryEditor config={editorConfig}>
          <PostPublishDialog />
          <StatusCheck />
          <PostLock />
        </StoryEditor>
      </StrictMode>
    </FlagsProvider>,
    appElement
  );
};

const initializeWithConfig = () => {
  const { id, config, flags } = window.webStoriesEditorSettings;
  initialize(id, config, flags);
};

if ('loading' === document.readyState) {
  document.addEventListener('DOMContentLoaded', initializeWithConfig);
} else {
  initializeWithConfig();
}
