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
import { TAB_IDS } from '../../../components/library/libraryProvider';
import { AnimationPane, AnimationTab } from './animation';
import { MediaPane, MediaTab } from './media/local';
import { Media3pPane, Media3pTab } from './media/media3p';
import { ShapesPane, ShapesTab } from './shapes';
import { TextPane, TextTab } from './text';
import { ElementsPane, ElementsTab } from './elements';
import { Tabs } from './shared';

const tabs = {
  [TAB_IDS.MEDIA]: { Tab: MediaTab, Pane: MediaPane, id: TAB_IDS.MEDIA },
  [TAB_IDS.MEDIA3P]: {
    Tab: Media3pTab,
    Pane: Media3pPane,
    id: TAB_IDS.MEDIA3P,
  },
  [TAB_IDS.TEXT]: { Tab: TextTab, Pane: TextPane, id: TAB_IDS.TEXT },
  [TAB_IDS.SHAPES]: { Tab: ShapesTab, Pane: ShapesPane, id: TAB_IDS.SHAPES },
  [TAB_IDS.ELEMENTS]: {
    Tab: ElementsTab,
    Pane: ElementsPane,
    id: TAB_IDS.ELEMENTS,
  },
  [TAB_IDS.ANIMATION]: {
    Tab: AnimationTab,
    Pane: AnimationPane,
    id: TAB_IDS.ANIMATION,
  },
};

/** @typedef {import('react').ReactElement} ReactElement */

/**
 * Return the necessary information to render the tab and pane for a tab ID.
 *
 * @param {string} tabId The id of the tab.
 * @return {Object<{Tab: ReactElement, Pane: ReactElement, id: string}>} Pane object.
 */
const getPane = (tabId) => tabs[tabId];

export { Tabs, getPane };
