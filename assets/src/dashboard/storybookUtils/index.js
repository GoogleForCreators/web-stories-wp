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
import { PAGE_WIDTH, PAGE_HEIGHT } from '../constants';

export { default as AMPStoryWrapper } from './ampStoryWrapper';
export { default as formattedStoriesArray } from '../dataUtils/formattedStoriesArray';
export { default as formattedTemplatesArray } from '../dataUtils/formattedTemplatesArray';
export { default as formattedUsersObject } from '../dataUtils/formattedUsersObject';
export { default as PlayButton } from './playButton';

export const STORYBOOK_PAGE_SIZE = {
  width: 212,
  height: 318,
  containerHeight: 376.89,
};

export const AMP_STORY_ASPECT_RATIO = `${PAGE_WIDTH}:${PAGE_HEIGHT}`;
