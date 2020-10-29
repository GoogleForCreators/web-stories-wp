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

// colors that are not subject to light or dark mode are stored in colors.
// colors related to light or dark mode are nested in colors.light or colors.dark
// it's important that the object structure be the same so that eventually we can flip from dark to light theme, vic versa

const brand = {
  gray: {
    60: '#2F3131',
    50: '#414442',
    40: '#5E615C',
    30: '#767570',
    20: '#A1A09B',
    10: '#EDEFEC',
  },
  violet: {
    60: '#6343CB',
    40: '#9A72EC',
    30: '#CBACFF',
    10: '#DFCDFE',
  },
  blue: {
    60: '#3E4796',
    40: '#5A72D0',
    30: '#79B3FF',
    10: '#C2DDFF',
  },
  red: {
    60: '#A92217',
    40: '#D84F35',
    30: '#F28B82',
    10: '#F6C6C6',
  },
  green: {
    60: '#325E37',
    40: '#518F58',
    30: '#81C995',
    10: '#CEE6D2',
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

export const dark = {
  standard,
  accent,
  status,
  ...brand,
  fg: {
    primary: '#EDEFEC',
    secondary: '#A1A09B',
    tertiary: '#767570',
    gray24: '#5E615C',
    gray16: '#414442',
    gray8: '#2F3131',
  },
  bg: {
    primary: standard.black,
    workspace: '#1B1D1C',
    panel: '#282A2A',
    divider: standard.white,
  },
};

export const light = {
  standard,
  accent,
  status,
  ...brand,
  fg: {
    primary: '#181D1C',
    secondary: '#5E615C',
    tertiary: '#767570',
    gray24: '#A1A09B',
    gray16: '#D1D1CC',
    gray8: '#EFEFEF',
  },
  bg: {
    primary: standard.white,
    workspace: '#FCFCFC',
    panel: '#F7F8F7',
    divider: '#1B1D1C',
  },
};
