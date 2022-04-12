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
import PanelTypes from './panelTypes';

const STYLE_PANE_IDS = {
  SELECTION: 'selection',
  LINK: 'link',
  ANIMATION: 'animation',
};

const {
  ELEMENT_ALIGNMENT,
  PAGE_BACKGROUND,
  PAGE_ATTACHMENT,
  PAGE_BACKGROUND_AUDIO,
  SIZE_POSITION,
  TEXT_STYLE,
  FILTER,
  SHAPE_STYLE,
  BORDER,
  ANIMATION,
  VIDEO_OPTIONS,
  CAPTIONS,
  LINK,
  IMAGE_ACCESSIBILITY,
  VIDEO_ACCESSIBILITY,
  PRODUCT,
} = PanelTypes;

const PanelSections = {
  [STYLE_PANE_IDS.SELECTION]: [
    ELEMENT_ALIGNMENT,
    PAGE_BACKGROUND,
    PAGE_ATTACHMENT,
    PAGE_BACKGROUND_AUDIO,
    SIZE_POSITION,
    TEXT_STYLE,
    FILTER,
    SHAPE_STYLE,
    BORDER,
    VIDEO_OPTIONS,
    CAPTIONS,
    IMAGE_ACCESSIBILITY,
    VIDEO_ACCESSIBILITY,
    PRODUCT,
  ],
  [STYLE_PANE_IDS.LINK]: [LINK],
  [STYLE_PANE_IDS.ANIMATION]: [ANIMATION],
};

export default PanelSections;
