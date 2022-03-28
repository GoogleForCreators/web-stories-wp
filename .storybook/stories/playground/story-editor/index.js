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
import {
  StoryEditor,
  InterfaceSkeleton,
} from '@googleforcreators/story-editor';
import { elementTypes } from '@googleforcreators/element-library';
import { registerElementType } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { getMedia, saveStoryById, getFonts } from './api';
import { HeaderLayout } from './header';
import { LOCAL_STORAGE_CONTENT_KEY } from './constants';

export default {
  title: 'Playground/Stories Editor',
};

export const _default = () => {
  const content = window.localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY);
  const story = content ? JSON.parse(content) : {};
  const apiCallbacks = { saveStoryById, getMedia, getFonts };

  elementTypes.forEach(registerElementType);

  return (
    <StoryEditor config={{ apiCallbacks }} initialEdits={{ story }}>
      <InterfaceSkeleton header={<HeaderLayout />} />
    </StoryEditor>
  );
};
