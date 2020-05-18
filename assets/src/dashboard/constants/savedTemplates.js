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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export const SAVED_TEMPLATES_STATUS = {
  ALL: 'bookmarked, current_user',
  CURRENT_USER: 'current_user',
  BOOKMARKED: 'bookmarked',
};
export const SAVED_TEMPLATES_STATUSES = [
  {
    label: __('All Templates', 'web-stories'),
    value: SAVED_TEMPLATES_STATUS.ALL,
  },
  {
    label: __('Created By Me', 'web-stories'),
    value: SAVED_TEMPLATES_STATUS.CURRENT_USER,
  },
  {
    label: __('Bookmarked', 'web-stories'),
    value: SAVED_TEMPLATES_STATUS.BOOKMARKED,
  },
];

export const SAVED_TEMPLATES_VIEWING_LABELS = {
  [SAVED_TEMPLATES_STATUS.ALL]: __('Viewing all templates', 'web-stories'),
  [SAVED_TEMPLATES_STATUS.CURRENT_USER]: __(
    "Viewing templates I've created",
    'web-stories'
  ),
  [SAVED_TEMPLATES_STATUS.BOOKMARKED]: __(
    "Viewing templates I've bookmarked",
    'web-stories'
  ),
};
