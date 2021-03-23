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

function fontObjects({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }) {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

const SYSTEM_FONTS = [
  'Arial',
  'Arial Black',
  'Arial Narrow',
  'Baskerville',
  'Brush Script MT',
  'Copperplate',
  'Courier New',
  'Century Gothic',
  'Garamond',
  'Georgia',
  'Gill Sans',
  'Lucida Bright',
  'Lucida Sans Typewriter',
  'Palatino',
  'Papyrus',
  'Tahoma',
  'Times New Roman',
  'Trebuchet MS',
  'Verdana',
];

function updateElement({ type, fontFamily, fontFallback, ...rest }) {
  if ('text' !== type) {
    return {
      type,
      ...rest,
    };
  }

  const isSystemFont = SYSTEM_FONTS.includes(fontFamily);

  return {
    font: {
      service: isSystemFont ? 'system' : 'fonts.google.com',
      family: fontFamily,
      fallbacks: fontFallback,
    },
    type,
    ...rest,
  };
}

export default fontObjects;
