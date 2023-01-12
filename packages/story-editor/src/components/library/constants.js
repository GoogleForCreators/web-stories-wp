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
import { __ } from '@googleforcreators/i18n';
import { Placement } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { MediaPane, MediaIcon } from './panes/media/local';
import { Media3pPane, Media3pIcon } from './panes/media/media3p';
import { ShapesPane, ShapesIcon } from './panes/shapes';
import { TextPane, TextIcon } from './panes/text';
import { PageTemplatesPane, PageTemplatesIcon } from './panes/pageTemplates';
import { ShoppingIcon, ShoppingPane } from './panes/shopping';
import { PANE_IDS } from './paneIds';

export const MEDIA = {
  icon: MediaIcon,
  tooltip: __('Media', 'web-stories'),
  placement: Placement.BottomStart,
  Pane: MediaPane,
  id: PANE_IDS.Media,
};
export const MEDIA3P = {
  icon: Media3pIcon,
  tooltip: __('Third-party media', 'web-stories'),
  Pane: Media3pPane,
  id: PANE_IDS.Media3p,
};
export const TEXT = {
  icon: TextIcon,
  tooltip: __('Text', 'web-stories'),
  Pane: TextPane,
  id: PANE_IDS.Text,
};
export const SHAPES = {
  icon: ShapesIcon,
  tooltip: __('Shapes & Stickers', 'web-stories'),
  Pane: ShapesPane,
  id: PANE_IDS.Shapes,
};
export const PAGE_TEMPLATES = {
  icon: PageTemplatesIcon,
  tooltip: __('Page Templates', 'web-stories'),
  Pane: PageTemplatesPane,
  id: PANE_IDS.PageTemplates,
};
export const SHOPPING = {
  icon: ShoppingIcon,
  tooltip: __('Shopping', 'web-stories'),
  Pane: ShoppingPane,
  id: PANE_IDS.Shopping,
};
