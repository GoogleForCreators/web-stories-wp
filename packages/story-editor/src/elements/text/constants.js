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
import { createSolid } from '@googleforcreators/patterns';
/**
 * Internal dependencies
 */
import { SHARED_DEFAULT_ATTRIBUTES } from '../shared/constants';
import { BACKGROUND_TEXT_MODE } from '../../constants';
import PanelTypes from '../../components/panels/design/types';
import { DEFAULT_PRESET } from '../../components/library/panes/text/textPresets';

const {
  borderRadius,
  font,
  fontSize,
  fontWeight,
  lineHeight,
  padding,
  textAlign,
  width,
} = DEFAULT_PRESET;

export const defaultAttributes = {
  ...SHARED_DEFAULT_ATTRIBUTES,
  backgroundColor: createSolid(196, 196, 196),
  backgroundTextMode: BACKGROUND_TEXT_MODE.NONE,
  borderRadius,
  font,
  fontSize,
  fontWeight,
  lineHeight,
  padding,
  textAlign,
  width,
};

export const clearableAttributes = {
  ...defaultAttributes,
  content: '',
  border: null,
  borderRadius: null,
  lockAspectRatio: undefined,
};

export const hasEditMode = true;

export const hasEditModeMoveable = true;

export const isMedia = false;

export const canFlip = false;

export const isMaskable = false;

export const resizeRules = {
  vertical: false,
  horizontal: true,
  diagonal: true,
  minWidth: 20,
  minHeight: 0, // Enforced by min font size
};

export const panels = [
  PanelTypes.ELEMENT_ALIGNMENT,
  PanelTypes.SIZE_POSITION,
  PanelTypes.TEXT_STYLE,
  PanelTypes.BORDER,
  PanelTypes.LINK,
  PanelTypes.ANIMATION,
];
