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
  LOADING_TEMPLATES: 'loading_templates',
  FETCH_TEMPLATES_SUCCESS: 'fetch_templates_success',
  FETCH_TEMPLATES_FAILURE: 'fetch_templates_failure',
  PLACEHOLDER: 'placeholder',
};

export const defaultTemplatesState = {
  allPagesFetched: false,
  error: {},
  isLoading: false,
  templates: {},
  templatesByTag: {},
  templatesOrderById: [],
  totalTemplates: null,
  totalPages: null,
};
