/*
 * Copyright 2021 Google LLC
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

/**
 * Internal dependencies
 */
import { PPC_CHECKPOINT_STATE } from './prepublishCheckpointState';

export const MAX_NUMBER_FOR_BADGE = 99;

export const TEXT = {
  DISPLAY_LINK: __('Link', 'web-stories'),
  ACCESSIBLE_LINK_TITLE: __('Select offending element', 'web-stories'),
  HIGH_PRIORITY_TITLE: __('High Priority', 'web-stories'),
  RECOMMENDED_TITLE: __('Recommended', 'web-stories'),
  EMPTY_TITLE: __('Awesome work!', 'web-stories'),
  EMPTY_BODY: __('No Issues Found', 'web-stories'),
};

export const DISABLED_HIGH_PRIORITY_CHECKPOINTS = [
  PPC_CHECKPOINT_STATE.UNAVAILABLE,
  PPC_CHECKPOINT_STATE.ONLY_RECOMMENDED,
];

export const DISABLED_RECOMMENDED_CHECKPOINTS = [
  PPC_CHECKPOINT_STATE.UNAVAILABLE,
];
