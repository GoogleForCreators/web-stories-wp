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
import { HighlightState, HighlightType } from '../../types/highlightsProvider';

export const STATES: HighlightState = {
  [HighlightType.STORY_TITLE]: {
    focus: true,
  },

  [HighlightType.ELEMENT_TOOLBAR_TOGGLE]: {
    focus: true,
  },

  // Sidebar tabs
  [HighlightType.STYLE_PANE]: {
    focus: true,
    tab: STYLE_SIDEBAR,
    section: STYLE_PANE_IDS.SELECTION,
  },

  [HighlightType.POSTER]: {
    focus: true,
    tab: DOCUMENT,
  },
  [HighlightType.PUBLISHER_LOGO]: {
    focus: true,
    tab: DOCUMENT,
  },
  [HighlightType.EXCERPT]: {
    focus: true,
    tab: DOCUMENT,
  },
  [HighlightType.PAGE_BACKGROUND_AUDIO]: {
    focus: true,
    tab: STYLE_SIDEBAR,
  },
  [HighlightType.CAPTIONS]: {
    focus: true,
    tab: STYLE_SIDEBAR,
    section: STYLE_PANE_IDS.SELECTION,
  },
  [HighlightType.ASSISTIVE_TEXT]: {
    focus: true,
    tab: STYLE_SIDEBAR,
    section: STYLE_PANE_IDS.SELECTION,
  },
  [HighlightType.PAGE_BACKGROUND]: {
    focus: true,
    tab: STYLE_SIDEBAR,
    section: STYLE_PANE_IDS.SELECTION,
  },
  [HighlightType.ANIMATION]: {
    focus: true,
    tab: STYLE_SIDEBAR,
    section: STYLE_PANE_IDS.ANIMATION,
  },
  [HighlightType.FONT]: {
    focus: true,
    tab: STYLE_SIDEBAR,
    section: STYLE_PANE_IDS.SELECTION,
  },
  [HighlightType.LINK]: {
    focus: true,
    tab: STYLE_SIDEBAR,
    section: STYLE_PANE_IDS.LINK,
  },
  [HighlightType.VIDEO_A11Y_POSTER]: {
    focus: true,
    tab: STYLE_SIDEBAR,
    section: STYLE_PANE_IDS.SELECTION,
  },
  [HighlightType.STYLE]: {
    focus: true,
    tab: STYLE_SIDEBAR,
    section: STYLE_PANE_IDS.SELECTION,
  },
  [HighlightType.TEXT_COLOR]: {
    focus: true,
    tab: STYLE_SIDEBAR,
    section: STYLE_PANE_IDS.SELECTION,
  },

  // Library
  [HighlightType.MEDIA]: {
    focus: true,
    tab: INSERT,
    section: PANE_IDS.MEDIA,
  },
  [HighlightType.MEDIA3P]: {
    focus: true,
    tab: INSERT,
    section: PANE_IDS.MEDIA_3P,
  },
  [HighlightType.TEXT_SET]: {
    focus: true,
    tab: INSERT,
    section: PANE_IDS.TEXT,
  },
  [HighlightType.PAGE_TEMPLATES]: {
    focus: true,
    tab: INSERT,
    section: PANE_IDS.PAGE_TEMPLATES,
  },
};
