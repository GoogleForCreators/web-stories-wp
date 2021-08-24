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
 * Internal dependencies
 */
import {
  SHARED_DEFAULT_ATTRIBUTES,
  SHARED_DEFAULT_CLEARABLE_ATTRIBUTES,
} from '../shared/constants';
import {
  MEDIA_DEFAULT_ATTRIBUTES,
  MEDIA_DEFAULT_CLEARABLE_ATTRIBUTES,
  MEDIA_PANELS,
} from '../media/constants';
import PanelTypes from '../../components/panels/design/types';

export {
  canFlip,
  isMaskable,
  isMedia,
  hasEditMode,
  editModeGrayout,
} from '../media/constants';

export { resizeRules } from '../media/constants';

export const defaultAttributes = {
  ...SHARED_DEFAULT_ATTRIBUTES,
  ...MEDIA_DEFAULT_ATTRIBUTES,
};

export const clearableAttributes = {
  ...SHARED_DEFAULT_CLEARABLE_ATTRIBUTES,
  ...MEDIA_DEFAULT_CLEARABLE_ATTRIBUTES,
};

export const panels = [
  PanelTypes.ELEMENT_ALIGNMENT,
  ...MEDIA_PANELS,
  PanelTypes.LINK,
  PanelTypes.IMAGE_ACCESSIBILITY,
];
