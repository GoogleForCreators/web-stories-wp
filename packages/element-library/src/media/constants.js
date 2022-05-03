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
import { DEFAULT_ATTRIBUTES_FOR_MEDIA } from '../constants';

export const MEDIA_DEFAULT_ATTRIBUTES = {
  ...DEFAULT_ATTRIBUTES_FOR_MEDIA,
  resource: {
    alt: '',
  },
};

export const MEDIA_MASK_OPACITY = 0.4;

export const hasEditMode = true;

export const hasDesignMenu = true;

export const isMedia = true;

export const canFlip = true;

export const isMaskable = true;

export const editModeGrayout = true;

export const resizeRules = {
  vertical: true,
  horizontal: true,
  diagonal: true,
  minWidth: 20,
  minHeight: 20,
};

export const MEDIA_PANELS = [
  PanelTypes.FILTER,
  PanelTypes.SIZE_POSITION,
  PanelTypes.BORDER,
  PanelTypes.ANIMATION,
  PanelTypes.LINK,
];
