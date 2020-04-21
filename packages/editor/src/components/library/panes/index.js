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
import { AnimationTab, AnimationPane } from './animation';
import { MediaTab, MediaPane } from './media';
import { ShapesTab, ShapesPane } from './shapes';
import { TextTab, TextPane } from './text';
import { Tabs } from './shared';

function getPanes({ ANIMATION, MEDIA, SHAPES, TEXT }) {
  // Order here is important, as it denotes the actual visual order of elements.
  return [
    { Tab: MediaTab, Pane: MediaPane, id: MEDIA },
    { Tab: TextTab, Pane: TextPane, id: TEXT },
    { Tab: ShapesTab, Pane: ShapesPane, id: SHAPES },
    { Tab: AnimationTab, Pane: AnimationPane, id: ANIMATION },
  ];
}

export { Tabs, getPanes };
