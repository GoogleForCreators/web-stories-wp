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

export default {
  FONTFAMILY: {
    PROPERTY: 'fontFamily',
  },
  FONTWEIGHT: {
    PROPERTY: 'fontWeight',
  },
  FONTSIZE: {
    PROPERTY: 'fontSize',
    MIN: 8,
    MAX: 800,
  },
  LINE_HEIGHT: {
    PROPERTY: 'lineHeight',
    MIN: 0.5,
    MAX: 10,
  },
  LETTER_SPACING: {
    PROPERTY: 'letterSpacing',
    MIN: 0,
    MAX: 300,
  },
  TEXTALIGN: {
    PROPERTY: 'textAlign',
    OPTIONS: {
      LEFT: 'left',
      CENTER: 'center',
      RIGHT: 'right',
      JUSTIFIED: 'justified',
    },
  },
  BOLD: {
    PROPERTY: 'isBold',
  },
  ITALIC: {
    PROPERTY: 'isItalic',
  },
  UNDERLINE: {
    PROPERTY: 'isUnderline',
  },
  FONTCOLOR: {
    PROPERTY: 'fontColor',
    id: 'fontColor',
  },
  BACKGROUNDMODE: {
    PROPERTY: 'backgroundMode',
    OPTIONS: {
      NONE: 'none',
      FILL: 'fill',
      HIGHLIGHT: 'highlight',
    },
  },
  BACKGROUNDCOLOR: {
    PROPERTY: 'backgroundColor',
    id: 'backgroundColor',
  },
  PADDINGVERTICAL: {
    PROPERTY: 'paddingVertical',
    MIN: 0,
    MAX: 300,
  },
  PADDINGHORIZONTAL: {
    PROPERTY: 'paddingHorizontal',
    MIN: 0,
    MAX: 300,
  },
  PADDINGLOCK: {
    PROPERTY: 'paddingLock',
  },
};
