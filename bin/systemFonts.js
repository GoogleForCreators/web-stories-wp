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

const DEFAULT_ATTRIBUTES = {
  weights: [400, 700],
  styles: ['italic', 'regular'],
  service: 'system',
};

const SYSTEM_FONTS = [
  {
    family: 'Arial',
    fallbacks: ['Helvetica Neue', 'Helvetica', 'sans-serif'],
    ...DEFAULT_ATTRIBUTES,
  },
  {
    family: 'Arial Black',
    fallbacks: ['Arial Black', 'Arial Bold', 'Gadget', 'sans-serif'],
    ...DEFAULT_ATTRIBUTES,
  },
  {
    family: 'Arial Narrow',
    fallbacks: ['Arial', 'sans-serif'],
    ...DEFAULT_ATTRIBUTES,
  },
  {
    family: 'Baskerville',
    fallbacks: [
      'Baskerville Old Face',
      'Hoefler Text',
      'Garamond',
      'Times New Roman',
      'serif',
    ],
    ...DEFAULT_ATTRIBUTES,
  },
  {
    family: 'Brush Script MT',
    fallbacks: ['cursive'],
    ...DEFAULT_ATTRIBUTES,
  },
  {
    family: 'Copperplate',
    fallbacks: ['Copperplate Gothic Light', 'fantasy'],
    ...DEFAULT_ATTRIBUTES,
  },
  {
    family: 'Courier New',
    fallbacks: [
      'Courier',
      'Lucida Sans Typewriter',
      'Lucida Typewriter',
      'monospace',
    ],
    ...DEFAULT_ATTRIBUTES,
  },
  {
    family: 'Century Gothic',
    fallbacks: ['CenturyGothic', 'AppleGothic', 'sans-serif'],
    ...DEFAULT_ATTRIBUTES,
  },
  {
    family: 'Garamond',
    fallbacks: [
      'Baskerville',
      'Baskerville Old Face',
      'Hoefler Text',
      'Times New Roman',
      'serif',
    ],
    ...DEFAULT_ATTRIBUTES,
  },
  {
    family: 'Georgia',
    fallbacks: ['Times', 'Times New Roman', 'serif'],
    ...DEFAULT_ATTRIBUTES,
  },
  {
    family: 'Gill Sans',
    fallbacks: ['Gill Sans MT', 'Calibri', 'sans-serif'],
    ...DEFAULT_ATTRIBUTES,
  },
  {
    family: 'Lucida Bright',
    fallbacks: ['Georgia', 'serif'],
    ...DEFAULT_ATTRIBUTES,
  },
  {
    family: 'Lucida Sans Typewriter',
    fallbacks: [
      'Lucida Console',
      'monaco',
      'Bitstream Vera Sans Mono',
      'monospace',
    ],
    ...DEFAULT_ATTRIBUTES,
  },
  {
    family: 'Palatino',
    fallbacks: [
      'Palatino Linotype',
      'Palatino LT STD',
      'Book Antiqua',
      'Georgia',
      'serif',
    ],
    ...DEFAULT_ATTRIBUTES,
  },
  {
    family: 'Papyrus',
    fallbacks: ['fantasy'],
    ...DEFAULT_ATTRIBUTES,
  },
  {
    family: 'Tahoma',
    fallbacks: ['Verdana', 'Segoe', 'sans-serif'],
    ...DEFAULT_ATTRIBUTES,
  },
  {
    family: 'Times New Roman',
    fallbacks: ['Times New Roman', 'Times', 'Baskerville', 'Georgia', 'serif'],
    ...DEFAULT_ATTRIBUTES,
  },
  {
    family: 'Trebuchet MS',
    fallbacks: [
      'Lucida Grande',
      'Lucida Sans Unicode',
      'Lucida Sans',
      'Tahoma',
      'sans-serif',
    ],
    ...DEFAULT_ATTRIBUTES,
  },
  {
    family: 'Verdana',
    fallbacks: ['Geneva', 'sans-serif'],
    ...DEFAULT_ATTRIBUTES,
  },
];

export default SYSTEM_FONTS;
