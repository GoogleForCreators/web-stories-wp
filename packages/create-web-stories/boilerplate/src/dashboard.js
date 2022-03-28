/*
 * Copyright 2022 Google LLC
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
import React from 'react';
import { Dashboard, InterfaceSkeleton } from '@googleforcreators/dashboard';
import { setAppElement } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { LOCAL_STORAGE_CONTENT_KEY } from './constants';
import { fetchStories, updateStory, trashStory } from './api/dashboard/story';

function CustomDashboard() {
  const content =
    JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY)) || {};
  const newId = Object.keys(content).length
    ? Math.max(
        ...Object.keys(content).map((x) => {
          return parseInt(x);
        })
      ) + 1
    : 1;
  const appElement = document.getElementById('root');

  // see http://reactcommunity.org/react-modal/accessibility/
  setAppElement(appElement);

  const config = {
    newStoryURL: '/editor?id=' + newId,
    apiCallbacks: {
      fetchStories,
      updateStory,
      trashStory,
    },
  };

  return (
    <Dashboard config={config}>
      <InterfaceSkeleton />
    </Dashboard>
  );
}

export default CustomDashboard;
