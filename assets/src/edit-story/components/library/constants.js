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
import { TOOLTIP_PLACEMENT } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { MediaPane, MediaIcon } from './panes/media/local';
import { Media3pPane, Media3pIcon } from './panes/media/media3p';
import { ShapesPane, ShapesIcon } from './panes/shapes';
import { TextPane, TextIcon } from './panes/text';
import { ElementsPane, ElementsIcon } from './panes/elements';
import { PageTemplatesPane, PageTemplatesIcon } from './panes/pageTemplates';

export const MEDIA = {
  icon: MediaIcon,
  tooltip: __('WordPress media', 'web-stories'),
  placement: TOOLTIP_PLACEMENT.BOTTOM_START,
  Pane: MediaPane,
  id: 'media',
};
export const MEDIA3P = {
  icon: Media3pIcon,
  tooltip: __('Third-party media', 'web-stories'),
  Pane: Media3pPane,
  id: 'media3p',
};
export const TEXT = {
  icon: TextIcon,
  tooltip: __('Text', 'web-stories'),
  Pane: TextPane,
  id: 'text',
};
export const SHAPES = {
  icon: ShapesIcon,
  tooltip: __('Shapes', 'web-stories'),
  Pane: ShapesPane,
  id: 'shapes',
};
export const ELEMS = {
  icon: ElementsIcon,
  tooltip: __('Elements', 'web-stories'),
  Pane: ElementsPane,
  id: 'elements',
};
export const PAGE_TEMPLATES = {
  icon: PageTemplatesIcon,
  tooltip: __('Page templates', 'web-stories'),
  Pane: PageTemplatesPane,
  id: 'pageTemplates',
};
