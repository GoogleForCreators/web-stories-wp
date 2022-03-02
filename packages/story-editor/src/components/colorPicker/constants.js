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
import { createSolidFromString } from '@googleforcreators/patterns';

export const LINE_LENGTH = 112;
export const LINE_WIDTH = 12;

export const GRADIENT_STOP_SIZE = 14;

export const TYPE_SOLID = 'solid';
export const TYPE_LINEAR = 'linear';
export const TYPE_RADIAL = 'radial';

export const CONFIRMATION_DIALOG_STORAGE_KEY =
  'DELETE_COLOR_PRESET_DIALOG_DISMISSED';

const c = (hex) => createSolidFromString(`#${hex}`);

export const BASIC_COLORS = [
  // Grays
  c('00000000'),
  c('000000'),
  c('454545'),
  c('B6B6B6'),
  c('EEEEEE'),
  c('FFFFFF'),
  // Blues
  c('003BAD'),
  c('0044C9'),
  c('0354F2'),
  c('1263FF'),
  c('347EFF'),
  c('6D9FFF'),
  // Purples
  c('4B1283'),
  c('5A189A'),
  c('7B2CBF'),
  c('9D4EDD'),
  c('C77DFF'),
  c('E0AAFF'),
  // Pinks
  c('E03568'),
  c('FF477E'),
  c('FF5C8A'),
  c('FF7096'),
  c('FF85A1'),
  c('FF99AC'),
  // Reds
  c('590D22'),
  c('800F2F'),
  c('A4133C'),
  c('C9184A'),
  c('FF4D6D'),
  c('FF758F'),
  // Yellows
  c('DBCA09'),
  c('FFD900'),
  c('FFE747'),
  c('FFEE70'),
  c('FFF599'),
  c('FFFFB7'),
  // Oranges
  c('E06E04'),
  c('EA7D00'),
  c('FF9500'),
  c('FFA811'),
  c('FFBC35'),
  c('FFCC4A'),
  // Greens
  c('607047'),
  c('79895D'),
  c('839568'),
  c('A5B98B'),
  c('C1D3AA'),
  c('D4E4C0'),
  // Browns
  c('603809'),
  c('603808'),
  c('6F4518'),
  c('8B5E34'),
  c('A47148'),
  c('BC8A5F'),
];
