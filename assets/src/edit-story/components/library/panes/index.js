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
/**
 * External dependencies
 */
import { TAB_IDS } from '../../../components/library/libraryProvider';
import { AnimationPane, AnimationTab } from './animation';
import { MediaPane, MediaTab } from './media';
import { Media3pPane, Media3pTab } from './media/media3p';
import { ShapesPane, ShapesTab } from './shapes';
import { TextPane, TextTab } from './text';
import { ElementsPane, ElementsTab } from './elements';
import { Tabs } from './shared';

/**
 * Return the necessary information to render the tab and pane for a tab ID.
 *
 * @param {string} tabId The id of the tab.
 */
function getPane(tabId) {
  switch (tabId) {
    case TAB_IDS.MEDIA:
      return { Tab: MediaTab, Pane: MediaPane, id: TAB_IDS.MEDIA };
    case TAB_IDS.MEDIA3P:
      return { Tab: Media3pTab, Pane: Media3pPane, id: TAB_IDS.MEDIA3P };
    case TAB_IDS.TEXT:
      return { Tab: TextTab, Pane: TextPane, id: TAB_IDS.TEXT };
    case TAB_IDS.SHAPES:
      return { Tab: ShapesTab, Pane: ShapesPane, id: TAB_IDS.SHAPES };
    case TAB_IDS.ELEMENTS:
      return { Tab: ElementsTab, Pane: ElementsPane, id: TAB_IDS.ELEMENTS };
    case TAB_IDS.ANIMATION:
      return { Tab: AnimationTab, Pane: AnimationPane, id: TAB_IDS.ANIMATION };
    default:
      throw new Error('Invalid tab id: ' + tabId);
  }
}

export { Tabs, getPane };
