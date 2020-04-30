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

const DEFAULT_WEIGHTS = [400, 700];
const DEFAULT_STYLES = ['italic', 'regular'];

const SYSTEM_FONTS = [
  {
    family: 'Arial',
    fallbacks: ['Helvetica Neue', 'Helvetica', 'sans-serif'],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Arial Black',
    fallbacks: ['Arial Black', 'Arial Bold', 'Gadget', 'sans-serif'],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Arial Narrow',
    fallbacks: ['Arial', 'sans-serif'],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
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
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Brush Script MT',
    fallbacks: ['cursive'],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Copperplate',
    fallbacks: ['Copperplate Gothic Light', 'fantasy'],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Courier New',
    fallbacks: [
      'Courier',
      'Lucida Sans Typewriter',
      'Lucida Typewriter',
      'monospace',
    ],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Century Gothic',
    fallbacks: ['CenturyGothic', 'AppleGothic', 'sans-serif'],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
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
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Georgia',
    fallbacks: ['Times', 'Times New Roman', 'serif'],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Gill Sans',
    fallbacks: ['Gill Sans MT', 'Calibri', 'sans-serif'],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Lucida Bright',
    fallbacks: ['Georgia', 'serif'],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Lucida Sans Typewriter',
    fallbacks: [
      'Lucida Console',
      'monaco',
      'Bitstream Vera Sans Mono',
      'monospace',
    ],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
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
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Papyrus',
    fallbacks: ['fantasy'],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Tahoma',
    fallbacks: ['Verdana', 'Segoe', 'sans-serif'],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Times New Roman',
    fallbacks: ['Times New Roman', 'Times', 'Baskerville', 'Georgia', 'serif'],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
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
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Verdana',
    fallbacks: ['Geneva', 'sans-serif'],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
];

export default SYSTEM_FONTS;
