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
import { __ } from '@web-stories-wp/i18n';

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

export const SAVED_TEMPLATE_CONTEXT_MENU_ACTIONS = {
  OPEN_IN_EDITOR: 'open-template-in-editor-action',
  PREVIEW: 'preview-action',
  RENAME: 'rename-action',
  DUPLICATE: 'duplicate-action',
  MODIFY_TEMPLATE: 'modify-template-action',
  DELETE: 'delete-story-action',
  CLOSE: 'close-menu',
};

export const SAVED_TEMPLATE_CONTEXT_MENU_ITEMS = [
  {
    label: __('Open in editor', 'web-stories'),
    value: false, // SAVED_TEMPLATE_CONTEXT_MENU_ACTIONS.OPEN_IN_EDITOR,
  },
  {
    label: __('Preview', 'web-stories'),
    value: SAVED_TEMPLATE_CONTEXT_MENU_ACTIONS.PREVIEW,
  },
  {
    label: __('Rename', 'web-stories'),
    value: false, // SAVED_TEMPLATE_CONTEXT_MENU_ACTIONS.RENAME,
    separator: 'top',
  },
  {
    label: __('Duplicate', 'web-stories'),
    value: false, // SAVED_TEMPLATE_CONTEXT_MENU_ACTIONS.DUPLICATE,
  },
  {
    label: __('Modify', 'web-stories'),
    value: false, // SAVED_TEMPLATE_CONTEXT_MENU_ACTIONS.MODIFY_TEMPLATE,
  },
  {
    label: __('Delete', 'web-stories'),
    value: false, // SAVED_TEMPLATE_CONTEXT_MENU_ACTIONS.DELETE,
  },
];
