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
import { TOOLTIP_PLACEMENT } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { MediaPane, MediaIcon } from './panes/media/local';
import { Media3pPane, Media3pIcon } from './panes/media/media3p';
import { ShapesPane, ShapesIcon } from './panes/shapes';
import { TextPane, TextIcon } from './panes/text';
import { ElementsPane, ElementsIcon } from './panes/elements';
import { PageTemplatesPane, PageTemplatesIcon } from './panes/pageTemplates';
import { PANE_IDS } from './paneIds';

export const MEDIA = {
  icon: MediaIcon,
  tooltip: __('Media', 'web-stories'),
  placement: TOOLTIP_PLACEMENT.BOTTOM_START,
  Pane: MediaPane,
  id: PANE_IDS.MEDIA,
};
export const MEDIA3P = {
  icon: Media3pIcon,
  tooltip: __('Third-party media', 'web-stories'),
  Pane: Media3pPane,
  id: PANE_IDS.MEDIA_3P,
};
export const TEXT = {
  icon: TextIcon,
  tooltip: __('Text', 'web-stories'),
  Pane: TextPane,
  id: PANE_IDS.TEXT,
};
export const SHAPES = {
  icon: ShapesIcon,
  tooltip: __('Shapes & Stickers', 'web-stories'),
  Pane: ShapesPane,
  id: PANE_IDS.SHAPES,
};
export const ELEMS = {
  icon: ElementsIcon,
  tooltip: __('Elements', 'web-stories'),
  Pane: ElementsPane,
  id: PANE_IDS.ELEMENTS,
};
export const PAGE_TEMPLATES = {
  icon: PageTemplatesIcon,
  tooltip: __('Page templates', 'web-stories'),
  Pane: PageTemplatesPane,
  id: PANE_IDS.PAGE_TEMPLATES,
};
