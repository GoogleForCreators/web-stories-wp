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
import { FlagsProvider } from 'flagged';
import { initializeTracking } from '@googleforcreators/tracking';

/**
 * WordPress dependencies
 */
import { StrictMode, render } from '@wordpress/element';

/**
 * Internal dependencies
 */
import App from './app';
import type { ContextState } from './app/config/context';

interface ActivationNoticeSettings {
  publicPath: string;
  id: string;
  config: ContextState;
  flags: Record<string, boolean>;
}

declare global {
  let __webpack_public_path__: string;

  interface Window {
    webStoriesActivationSettings: ActivationNoticeSettings;
  }
}

__webpack_public_path__ = window.webStoriesActivationSettings.publicPath;

/**
 * Initializes the Web Stories dashboard screen.
 *
 * @param id       ID of the root element to render the screen in.
 * @param config   Story editor settings.
 * @param flags    The flags for the application.
 */
const initialize = (
  id: string,
  config: ContextState,
  flags: Record<string, boolean>
) => {
  const appElement = document.getElementById(id);

  void initializeTracking('Plugin Activation');

  render(
    <FlagsProvider features={flags}>
      <StrictMode>
        <App config={config} />
      </StrictMode>
    </FlagsProvider>,
    appElement
  );
};

const initializeWithConfig = () => {
  const { id, config, flags } = window.webStoriesActivationSettings;
  initialize(id, config, flags);
};

if ('loading' === document.readyState) {
  document.addEventListener('DOMContentLoaded', initializeWithConfig);
} else {
  initializeWithConfig();
}
