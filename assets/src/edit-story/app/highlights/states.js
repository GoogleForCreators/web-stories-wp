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
import { DOCUMENT, DESIGN } from '../../components/inspector';

/**
 * Highlight state object
 *
 * @typedef {Highlight} Highlight The current state of editor highlights
 * @property {string} tab The ID of the Inspector tab to highlight
 * @property {boolean} focus Whether there is a focusable element, use for accessibility
 *
 */

const keys = {
  STORY_TITLE: 'STORY_TITLE',
  POSTER: 'POSTER',
  PUBLISHER_LOGO: 'PUBLISHER_LOGO',
  EXCERPT: 'EXCERPT',
  CAPTIONS: 'CAPTIONS',
  ASSISTIVE_TEXT: 'ASSISTIVE_TEXT',
};

export const STATES = {
  [keys.STORY_TITLE]: {
    focus: true,
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
  [keys.CAPTIONS]: {
    focus: true,
    tab: DESIGN,
  },
  [keys.ASSISTIVE_TEXT]: {
    focus: true,
    tab: DESIGN,
  },
};

export default keys;
