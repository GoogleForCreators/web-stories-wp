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
export const ACTION_TYPES = {
  CREATING_STORY_FROM_TEMPLATE: 'creating_story_from_template',
  CREATE_STORY_FROM_TEMPLATE_SUCCESS: 'create_story_from_template_success',
  CREATE_STORY_FROM_TEMPLATE_FAILURE: 'create_story_from_template_failure',
  LOADING_STORIES: 'loading_stories',
  FETCH_STORIES_SUCCESS: 'fetch_stories_success',
  FETCH_STORIES_FAILURE: 'fetch_stories_failure',
  UPDATE_STORY: 'update_story',
  UPDATE_STORY_FAILURE: 'update_story_failure',
  TRASH_STORY: 'trash_story',
  TRASH_STORY_FAILURE: 'trash_story_failure',
  DUPLICATE_STORY: 'duplicate_story',
  DUPLICATE_STORY_FAILURE: 'duplicate_story_failure',
};

export const defaultStoriesState = {
  error: {},
  isLoading: false,
  stories: {},
  storiesOrderById: [],
  totalStoriesByStatus: {},
  totalPages: null,
};
