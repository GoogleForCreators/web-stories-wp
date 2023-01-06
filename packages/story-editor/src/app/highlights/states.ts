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
import {
  INSERT,
  DOCUMENT,
  STYLE as STYLE_SIDEBAR,
} from '../../components/sidebar/constants';
import { PANE_IDS } from '../../components/library/paneIds';
import type { HighlightState } from '../../types/highlightsProvider';

export enum HighlightType {
  StoryTitle = 'STORY_TITLE',
  ElementToolbarToggle = 'ELEMENT_TOOLBAR_TOGGLE',

  // Sidebar tabs
  StylePane = 'STYLE_PANE',

  // STYLE
  Animation = 'ANIMATION',
  AssistiveText = 'ASSISTIVE_TEXT',
  Captions = 'Captions',
  Excerpt = 'EXCERPT',
  Link = 'LINK',
  PageBackground = 'PAGE_BACKGROUND',
  Poster = 'POSTER',
  PublisherLogo = 'PUBLISHER_LOGO',
  VideoA11yPoster = 'VIDEO_A11Y_POSTER',
  Style = 'STYLE',
  Font = 'FONT',
  TextColor = 'TEXT_COLOR',

  // LIBRARY
  Media = 'MEDIA',
  Media3p = 'MEDIA3P',
  TextSet = 'TEXT',
  PageTemplates = 'PAGE_TEMPLATES',

  // DOCUMENT
  PageBackgroundAudio = 'PAGE_BACKGROUND_AUDIO',
}

export const STATES: HighlightState = {
  [HighlightType.StoryTitle]: {
    focus: true,
  },

  [HighlightType.ElementToolbarToggle]: {
    focus: true,
  },

  // Sidebar tabs
  [HighlightType.StylePane]: {
    focus: true,
    tab: STYLE_SIDEBAR,
    section: STYLE_PANE_IDS.Selection,
  },

  [HighlightType.Poster]: {
    focus: true,
    tab: DOCUMENT,
  },
  [HighlightType.PublisherLogo]: {
    focus: true,
    tab: DOCUMENT,
  },
  [HighlightType.Excerpt]: {
    focus: true,
    tab: DOCUMENT,
  },
  [HighlightType.PageBackgroundAudio]: {
    focus: true,
    tab: STYLE_SIDEBAR,
  },
  [HighlightType.Captions]: {
    focus: true,
    tab: STYLE_SIDEBAR,
    section: STYLE_PANE_IDS.Selection,
  },
  [HighlightType.AssistiveText]: {
    focus: true,
    tab: STYLE_SIDEBAR,
    section: STYLE_PANE_IDS.Selection,
  },
  [HighlightType.PageBackground]: {
    focus: true,
    tab: STYLE_SIDEBAR,
    section: STYLE_PANE_IDS.Selection,
  },
  [HighlightType.Animation]: {
    focus: true,
    tab: STYLE_SIDEBAR,
    section: STYLE_PANE_IDS.Animation,
  },
  [HighlightType.Font]: {
    focus: true,
    tab: STYLE_SIDEBAR,
    section: STYLE_PANE_IDS.Selection,
  },
  [HighlightType.Link]: {
    focus: true,
    tab: STYLE_SIDEBAR,
    section: STYLE_PANE_IDS.Link,
  },
  [HighlightType.VideoA11yPoster]: {
    focus: true,
    tab: STYLE_SIDEBAR,
    section: STYLE_PANE_IDS.Selection,
  },
  [HighlightType.Style]: {
    focus: true,
    tab: STYLE_SIDEBAR,
    section: STYLE_PANE_IDS.Selection,
  },
  [HighlightType.TextColor]: {
    focus: true,
    tab: STYLE_SIDEBAR,
    section: STYLE_PANE_IDS.Selection,
  },

  // Library
  [HighlightType.Media]: {
    focus: true,
    tab: INSERT,
    section: PANE_IDS.Media,
  },
  [HighlightType.Media3p]: {
    focus: true,
    tab: INSERT,
    section: PANE_IDS.Media3p,
  },
  [HighlightType.TextSet]: {
    focus: true,
    tab: INSERT,
    section: PANE_IDS.Text,
  },
  [HighlightType.PageTemplates]: {
    focus: true,
    tab: INSERT,
    section: PANE_IDS.PageTemplates,
  },
};
