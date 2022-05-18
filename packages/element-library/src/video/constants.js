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
import { PanelTypes } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import {
  MEDIA_DEFAULT_ATTRIBUTES,
  MEDIA_PANELS,
  resizeRules as mediaResizeRules,
} from '../media/constants';
import { SHARED_DEFAULT_ATTRIBUTES } from '../shared';

export {
  canFlip,
  isMaskable,
  isMedia,
  hasEditMode,
  hasEditModeIfLocked,
  hasDesignMenu,
  editModeGrayout,
} from '../media/constants';

export const resizeRules = {
  ...mediaResizeRules,
};

export const defaultAttributes = {
  ...SHARED_DEFAULT_ATTRIBUTES,
  ...MEDIA_DEFAULT_ATTRIBUTES,
  controls: false,
  loop: false,
  autoPlay: true,
  tracks: [],
  resource: {
    posterId: null,
    poster: null,
    id: 0,
    alt: '',
  },
};

export const panels = [
  PanelTypes.ELEMENT_ALIGNMENT,
  ...MEDIA_PANELS,
  PanelTypes.VIDEO_OPTIONS,
  PanelTypes.VIDEO_ACCESSIBILITY,
  PanelTypes.CAPTIONS,
];
