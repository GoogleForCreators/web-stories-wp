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
import { rgba } from 'polished';

// colors that are not subject to light or dark mode are stored in colors.
// colors related to light or dark mode are nested in colors.light or colors.dark
// it's important that the object structure be the same so that eventually we can flip from dark to light theme, vic versa

const brand = {
  gray: {
    90: '#131516',
    80: '#26292A',
    70: '#393D3F',
    60: '#4B5253',
    50: '#5E6668',
    40: '#767E80',
    30: '#919899',
    20: '#ADB1B3',
    10: '#C8CBCC',
    5: '#E4E5E6',
  },
  violet: {
    90: '#351E7A',
    80: '#482A90',
    70: '#5732A3',
    60: '#6B3DBA',
    50: '#7B46CB',
    40: '#9464E1',
    30: '#B488FC',
    20: '#CBACFF',
    10: '#DFCDFE',
    5: '#F3EBFF',
  },
  blue: {
    90: '#2C2864',
    80: '#364286',
    70: '#4157A3',
    60: '#476ABD',
    50: '#4F7ED9',
    40: '#5D96EB',
    30: '#79B3FF',
    20: '#9CC9FF',
    10: '#C2DDFF',
    5: '#E5F2FF',
  },
  red: {
    90: '#690000',
    80: '#7E0000',
    70: '#930500',
    60: '#AC1501',
    50: '#C42300',
    40: '#D43626',
    30: '#E45F53',
    20: '#F28B82',
    10: '#FFC4C5',
    5: '#FFE7E9',
  },
  green: {
    90: '#133B20',
    80: '#205630',
    70: '#296B3C',
    60: '#34824B',
    50: '#3F9A5A',
    40: '#5EAE75',
    30: '#81C995',
    20: '#A5D7B3',
    10: '#C8E7D0',
    5: '#E8F5EC',
  },
};
const accent = {
  primary: brand.violet[30],
  secondary: brand.blue[30],
};
const status = {
  negative: '#D93025',
  positive: '#188038',
};
const standard = {
  black: '#000',
  white: '#FFF',
};

const opacity = {
  footprint: 'transparent',
  white64: rgba(standard.white, 0.64),
  white24: rgba(standard.white, 0.24),
  white16: rgba(standard.white, 0.16),
  black64: rgba(standard.black, 0.64),
  black24: rgba(standard.black, 0.24),
  black10: rgba(standard.black, 0.1),
  blue24: rgba(brand.blue[30], 0.24),
  violet24: rgba(brand.violet[30], 0.24),
};

export const dark = {
  standard,
  accent,
  status,
  opacity,
  ...brand,
  fg: {
    primary: brand.gray[5],
    secondary: brand.gray[20],
    tertiary: brand.gray[40],
    disable: brand.gray[50],
    linkNormal: brand.blue[30],
    linkHover: brand.blue[40],
    positive: brand.green[30],
    negative: brand.red[30],
  },
  bg: {
    primary: brand.gray[90],
    secondary: brand.gray[80],
    tertiary: brand.gray[70],
    quaternary: brand.gray[60],
    positive: brand.green[90],
    negative: brand.red[90],
  },
  interactiveBg: {
    active: brand.violet[70],
    disable: brand.gray[80],
    brandNormal: brand.violet[20],
    brandHover: brand.violet[30],
    brandPress: brand.violet[40],
    primaryNormal: brand.gray[10],
    primaryHover: brand.gray[20],
    primaryPress: brand.gray[30],
    secondaryNormal: brand.gray[70],
    secondaryHover: brand.gray[60],
    secondaryPress: brand.gray[50],
    tertiaryNormal: opacity.footprint,
    tertiaryHover: brand.gray[70],
    tertiaryPress: brand.gray[60],
    negativeNormal: brand.red[40],
    negativeHover: brand.red[30],
    negativePress: brand.red[20],
    positiveNormal: brand.green[40],
    positiveHover: brand.green[30],
    positivePress: brand.green[20],
  },
  border: {
    focus: brand.blue[30],
    disable: brand.gray[70],
    defaultNormal: brand.gray[50],
    defaultHover: brand.gray[40],
    defaultPress: brand.gray[30],
    defaultActive: brand.gray[10],
    positiveNormal: brand.green[40],
    positiveHover: brand.green[30],
    positivePress: brand.green[20],
    positiveAction: brand.green[10],
    negativeNormal: brand.red[40],
    negativeHover: brand.red[30],
    negativePress: brand.red[20],
    negativeActive: brand.red[10],
  },
  divider: {
    primary: opacity.white24,
    secondary: opacity.white16,
  },
};

export const light = {
  standard,
  accent,
  status,
  ...brand,
  fg: {
    primary: brand.gray[90],
    secondary: brand.gray[70],
    tertiary: brand.gray[50],
    disable: brand.gray[30],
    linkNormal: brand.blue[80],
    linkHover: brand.blue[90],
    positive: brand.green[80],
    negative: brand.red[80],
  },
  bg: {
    primary: standard.white,
    secondary: brand.gray[5],
    tertiary: brand.gray[10],
    quaternary: brand.gray[20],
    positive: brand.green[10],
    negative: brand.red[10],
  },
  interactiveBg: {
    active: brand.violet[10],
    disable: brand.gray[10],
    brandNormal: brand.violet[20],
    brandHover: brand.violet[30],
    brandPress: brand.violet[40],
    primaryNormal: brand.gray[90],
    primaryHover: brand.gray[80],
    primaryPress: brand.gray[70],
    secondaryNormal: brand.gray[20],
    secondaryHover: brand.gray[30],
    secondaryPress: brand.gray[40],
    tertiaryNormal: opacity.footprint,
    tertiaryHover: brand.gray[10],
    tertiaryPress: brand.gray[20],
    negativeNormal: brand.red[20],
    negativeHover: brand.red[30],
    negativePress: brand.red[40],
    positiveNormal: brand.green[20],
    positiveHover: brand.green[30],
    positivePress: brand.green[40],
  },
  border: {
    focus: brand.blue[40],
    disable: brand.gray[10],
    defaultNormal: brand.gray[20],
    defaultHover: brand.gray[30],
    defaultPress: brand.gray[40],
    defaultActive: brand.gray[90],
    positiveNormal: brand.green[20],
    positiveHover: brand.green[30],
    positivePress: brand.green[40],
    positiveAction: brand.green[90],
    negativeNormal: brand.red[20],
    negativeHover: brand.red[30],
    negativePress: brand.red[40],
    negativeActive: brand.red[90],
  },
  divider: {
    primary: opacity.black24,
    secondary: opacity.black10,
  },
};
