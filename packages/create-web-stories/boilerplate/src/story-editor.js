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
import { hot } from 'react-hot-loader';
import {
  StoryEditor,
  InterfaceSkeleton,
} from '@googleforcreators/story-editor';
import { elementTypes } from '@googleforcreators/element-library';
import { registerElementType } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { HeaderLayout } from './components/header';
import { saveStoryById } from './api/story-editor/story';
import { LOCAL_STORAGE_CONTENT_KEY } from './constants';

function CustomEditor() {
  elementTypes.forEach(registerElementType);

  const url = new URL(window.location.href);
  const id = url.searchParams.get('id');

  const content =
    JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY)) || {};
  const story = content[id] ? content[id] : {};
  const apiCallbacks = { saveStoryById };
  const config = {
    storyId: Number(id),
    apiCallbacks,
  };

  return (
    <div style={{ height: '100vh' }}>
      <StoryEditor config={config} initialEdits={{ story }}>
        <InterfaceSkeleton header={<HeaderLayout />} />
      </StoryEditor>
    </div>
  );
}

export default hot(module)(CustomEditor);
