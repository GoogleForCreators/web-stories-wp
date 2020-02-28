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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getDefinitionForType } from '../elements';

export const MaskTypes = {
  HEART: 'heart',
  STAR: 'star',
  CIRCLE: 'circle',
  RECTANGLE: 'rectangle',
  TRIANGLE: 'triangle',
  ROUNDED: 'rounded-rectangle',
  POLYGON: 'polygon',
};

export const CLIP_PATHS = {
  [MaskTypes.HEART]:
    'M 0.5,1 C 0.5,1,0,0.7,0,0.3 A 0.25,0.25,1,1,1,0.5,0.3 A 0.25,0.25,1,1,1,1,0.3 C 1,0.7,0.5,1,0.5,1 Z',
  [MaskTypes.STAR]:
    'M 0.5 0.75 L 0.207031 0.90625 L 0.261719 0.578125 L 0.0234375 0.34375 L 0.351562 0.296875 L 0.5 0 L 0.648438 0.296875 L 0.976562 0.34375 L 0.738281 0.578125 L 0.792969 0.90625 Z M 0.5 0.75',
  [MaskTypes.RECTANGLE]: 'M 0,0 1,0 1,1 0,1 0,0',
  [MaskTypes.TRIANGLE]: 'M 0.5 0 L 1 1 L 0 1 Z M 0.5 0',
  [MaskTypes.CIRCLE]:
    'M 0.5 0 C 0.777344 0 1 0.222656 1 0.5 C 1 0.777344 0.777344 1 0.5 1 C 0.222656 1 0 0.777344 0 0.5 C 0 0.222656 0.222656 0 0.5 0 Z M 0.5 0 ',
  [MaskTypes.POLYGON]:
    'M 0.5 0 L 0.976562 0.34375 L 0.792969 0.90625 L 0.207031 0.90625 L 0.0234375 0.34375 Z M 0.5 0',
};

export const MASKS = [
  {
    type: MaskTypes.HEART,
    name: __('Heart', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.HEART],
  },
  {
    type: MaskTypes.STAR,
    name: __('Star', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.STAR],
  },
  {
    type: MaskTypes.RECTANGLE,
    name: __('Rectangle', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.RECTANGLE],
  },
  {
    type: MaskTypes.TRIANGLE,
    name: __('Triangle', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.TRIANGLE],
  },
  {
    type: MaskTypes.CIRCLE,
    name: __('Circle', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.CIRCLE],
  },
  {
    type: MaskTypes.POLYGON,
    name: __('Polygon', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.POLYGON],
  },
];

export const DEFAULT_MASK = MASKS.find(
  (mask) => mask.type === MaskTypes.RECTANGLE
);

export function getElementMask({ type, mask }) {
  if (mask) {
    return mask;
  }
  return getDefaultElementMask(type);
}

function getDefaultElementMask(type) {
  const { isMedia } = getDefinitionForType(type);
  return isMedia ? DEFAULT_MASK : null;
}
