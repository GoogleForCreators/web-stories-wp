/*
 * Copyright 2022 Google LLC
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
import type { Element, ElementId } from '@googleforcreators/elements';

export enum HighlightType {
  STORY_TITLE = 'STORY_TITLE',
  ELEMENT_TOOLBAR_TOGGLE = 'ELEMENT_TOOLBAR_TOGGLE',

  // Sidebar tabs
  STYLE_PANE = 'STYLE_PANE',

  ANIMATION = 'ANIMATION',
  ASSISTIVE_TEXT = 'ASSISTIVE_TEXT',
  CAPTIONS = 'CAPTIONS',
  EXCERPT = 'EXCERPT',
  LINK = 'LINK',
  PAGE_BACKGROUND = 'PAGE_BACKGROUND',
  POSTER = 'POSTER',
  PUBLISHER_LOGO = 'PUBLISHER_LOGO',
  VIDEO_A11Y_POSTER = 'VIDEO_A11Y_POSTER',
  STYLE = 'STYLE',
  FONT = 'FONT',
  TEXT_COLOR = 'TEXT_COLOR',

  // LIBRARY
  MEDIA = 'MEDIA',
  MEDIA3P = 'MEDIA3P',
  TEXT_SET = 'TEXT',
  PAGE_TEMPLATES = 'PAGE_TEMPLATES',

  // DOCUMENT
  PAGE_BACKGROUND_AUDIO = 'PAGE_BACKGROUND_AUDIO',
}

export interface selectElementProps {
  elements?: Element[];
  elementId?: ElementId;
  pageId?: string;
}

export interface setHighlightProps {
  elements?: Element[];
  elementId?: ElementId;
  pageId?: string;
  highlight?: HighlightType;
}

export interface HighlightsState {
  cancelEffect: (stateKey: HighlightType) => void;
  onFocusOut: () => void;
  setHighlights: (highlights: setHighlightProps) => void;
}
