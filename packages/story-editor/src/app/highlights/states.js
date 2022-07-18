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
 * External dependencies
 */
import { STYLE_PANE_IDS } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { INSERT, DOCUMENT, STYLE } from '../../components/sidebar';
import { PANE_IDS } from '../../components/library/paneIds';

/**
 * Highlight state object
 *
 * @typedef {Highlight} Highlight The current state of editor highlights
 * @property {string} tab The ID of the Sidebar tab to highlight
 * @property {boolean} focus Whether there is a focusable element, use for accessibility
 */

const keys = {
  STORY_TITLE: 'STORY_TITLE',

  // Sidebar tabs
  STYLE_PANE: 'STYLE_PANE',

  // STYLE
  ANIMATION: 'ANIMATION',
  ASSISTIVE_TEXT: 'ASSISTIVE_TEXT',
  CAPTIONS: 'CAPTIONS',
  EXCERPT: 'EXCERPT',
  LINK: 'LINK',
  PAGE_BACKGROUND: 'PAGE_BACKGROUND',
  POSTER: 'POSTER',
  PUBLISHER_LOGO: 'PUBLISHER_LOGO',
  VIDEO_A11Y_POSTER: 'VIDEO_A11Y_POSTER',
  STYLE: 'STYLE',
  FONT: 'FONT',
  TEXT_COLOR: 'TEXT_COLOR',

  // LIBRARY
  MEDIA: 'MEDIA',
  MEDIA3P: 'MEDIA3P',
  TEXT_SET: 'TEXT',
  PAGE_TEMPLATES: 'PAGE_TEMPLATES',

  // DOCUMENT
  BACKGROUND_AUDIO: 'BACKGROUND_AUDIO',
};

export const STATES = {
  [keys.STORY_TITLE]: {
    focus: true,
  },

  // Sidebar tabs
  [keys.STYLE_PANE]: {
    focus: true,
    tab: STYLE,
    section: STYLE_PANE_IDS.SELECTION,
  },

  [keys.POSTER]: {
    focus: true,
    tab: DOCUMENT,
  },
  [keys.PUBLISHER_LOGO]: {
    focus: true,
    tab: DOCUMENT,
  },
  [keys.EXCERPT]: {
    focus: true,
    tab: DOCUMENT,
  },
  [keys.BACKGROUND_AUDIO]: {
    focus: true,
    tab: DOCUMENT,
  },
  [keys.CAPTIONS]: {
    focus: true,
    tab: STYLE,
    section: STYLE_PANE_IDS.SELECTION,
  },
  [keys.ASSISTIVE_TEXT]: {
    focus: true,
    tab: STYLE,
    section: STYLE_PANE_IDS.SELECTION,
  },
  [keys.PAGE_BACKGROUND]: {
    focus: true,
    tab: STYLE,
    section: STYLE_PANE_IDS.SELECTION,
  },
  [keys.ANIMATION]: {
    focus: true,
    tab: STYLE,
    section: STYLE_PANE_IDS.ANIMATION,
  },
  [keys.FONT]: {
    focus: true,
    tab: STYLE,
    section: STYLE_PANE_IDS.SELECTION,
  },
  [keys.LINK]: {
    focus: true,
    tab: STYLE,
    section: STYLE_PANE_IDS.LINK,
  },
  [keys.VIDEO_A11Y_POSTER]: {
    focus: true,
    tab: STYLE,
    section: STYLE_PANE_IDS.SELECTION,
  },
  [keys.STYLE]: {
    focus: true,
    tab: STYLE,
    section: STYLE_PANE_IDS.SELECTION,
  },
  [keys.TEXT_COLOR]: {
    focus: true,
    tab: STYLE,
    section: STYLE_PANE_IDS.SELECTION,
  },

  // Library
  [keys.MEDIA]: {
    focus: true,
    tab: INSERT,
    section: PANE_IDS.MEDIA,
  },
  [keys.MEDIA3P]: {
    focus: true,
    tab: INSERT,
    section: PANE_IDS.MEDIA_3P,
  },
  [keys.TEXT_SET]: {
    focus: true,
    tab: INSERT,
    section: PANE_IDS.TEXT,
  },
  [keys.PAGE_TEMPLATES]: {
    focus: true,
    tab: INSERT,
    section: PANE_IDS.PAGE_TEMPLATES,
  },
};

export default keys;
