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
  PENTAGON: 'pentagon',
  HEXAGON: 'hexagon',
  BLOB: 'blob',
  CROSS: 'cross',
  ARROW: 'arrow',
  BURST: 'burst',
};

const CLIP_PATHS = {
  [MaskTypes.RECTANGLE]: 'M 0,0 1,0 1,1 0,1 0,0 Z',
  [MaskTypes.CIRCLE]:
    'M 0.5 0 C 0.777344 0 1 0.222656 1 0.5 C 1 0.777344 0.777344 1 0.5 1 C 0.222656 1 0 0.777344 0 0.5 C 0 0.222656 0.222656 0 0.5 0 Z',
  [MaskTypes.TRIANGLE]: 'M 0.5 0 L 1 1 L 0 1 Z',
  [MaskTypes.HEART]:
    'M.99834689.27724859C.98374997.1165844.87003101.00001922.7277144.00001922c-.0948137 0-.18162681.05102248-.23047608.13279699C.44883142.04998394.36557613 0 .27228183 0 .12998435 0 .01624632.1165652.00166847.27722932c-.00115382.007097-.00588463.0444451.00850059.10535296.0207321.0878518.06861968.1677608.13845102.23103404l.34838744.31615494.35436847-.31613565c.0698315-.0632926.1177191-.14318227.13845114-.23105333.0143856-.0608885.009655-.0982371.00852-.10533369 Z',
  [MaskTypes.STAR]:
    'M 0.50000026,0.78688566 0.19262278,0.95082018 0.2500004,0.6065577 0,0.36065594 0.34426194,0.31147556 0.50000026,0 0.65573858,0.31147556 1,0.36065594 0.75000014,0.6065577 0.80737774,0.95082018 Z',
  [MaskTypes.PENTAGON]:
    'M 0.50000026,0 1,0.36065593 0.80737774,0.95082017 H 0.19262279 L 0,0.36065593 Z',
  [MaskTypes.HEXAGON]:
    'm 0.74863333,0 h -0.494535 L 0,0.42896111 0.25409833,0.86611944 h 0.494535 L 1,0.42896111 Z',
  [MaskTypes.BLOB]:
    'M0.830816788,0.220786927 C0.875069274,0.303846138 0.868747722,0.386905348 0.900357103,0.469964559 C0.931968103,0.553023769 1.00150842,0.641273848 0.995186867,0.750290059 C0.995186867,0.854114072 0.925644932,0.973510691 0.818172064,0.994276822 C0.710699195,1.0150403 0.571615327,0.942364151 0.426211524,0.89045148 C0.280806103,0.838540138 0.135400682,0.817775335 0.0658587481,0.739906993 C-0.0100047388,0.667230848 -0.00368318612,0.542642033 0.0216062612,0.423244085 C0.0405709191,0.298655269 0.091146577,0.179257322 0.18597634,0.10138898 C0.287127656,0.0183297695 0.43885463,-0.0180076384 0.565293774,0.0131389011 C0.685411367,0.0390959011 0.78024113,0.132536848 0.830816788,0.220786927 Z',
  [MaskTypes.CROSS]:
    'M 0.000 0.861 L 0.861 0.000 l 0.089 0.083 L 0.083 0.950 z M 0.089 0.000 l 0.461 0.461 L 0.461 0.556 0.000 0.089 z m 0.561 0.561 l 0.322 0.322 -0.083 0.089 -0.322 -0.322 z',
  [MaskTypes.ARROW]:
    'M 0.889 0.433 V 0.494 C 0.913 0.494 0.935 0.480 0.945 0.458 C 0.955 0.435 0.950 0.409 0.933 0.391 L 0.889 0.433 Z  M 0.571 0.932 L 0.876 0.626 L 0.790 0.540 L 0.485 0.846 L 0.571 0.932 Z  M 0.000 0.494 H 0.889 V 0.372 H 0.000 V 0.494 Z  M 0.933 0.391 L 0.578 0.014 L 0.489 0.097 L 0.844 0.475 L 0.933 0.391 Z',
  [MaskTypes.BURST]:
    'M 0.496 0.058 L 0.558 0 L 0.604 0.072 L 0.679 0.031 L 0.706 0.112 L 0.788 0.091 L 0.794 0.176 L 0.879 0.177 L 0.863 0.261 L 0.946 0.282 L 0.91 0.359 L 0.984 0.401 L 0.93 0.467 L 0.992 0.525 L 0.923 0.576 L 0.969 0.648 L 0.89 0.68 L 0.916 0.761 L 0.831 0.772 L 0.836 0.857 L 0.752 0.847 L 0.736 0.931 L 0.656 0.899 L 0.62 0.977 L 0.551 0.926 L 0.496 0.992 L 0.442 0.926 L 0.372 0.977 L 0.336 0.899 L 0.257 0.931 L 0.24 0.847 L 0.156 0.857 L 0.161 0.772 L 0.076 0.761 L 0.103 0.68 L 0.023 0.648 L 0.069 0.576 L 0 0.525 L 0.062 0.467 L 0.008 0.401 L 0.082 0.359 L 0.046 0.282 L 0.129 0.261 L 0.113 0.177 L 0.198 0.176 L 0.204 0.091 L 0.287 0.112 L 0.313 0.031 L 0.388 0.072 L 0.434 0 L 0.496 0.058 Z',
};

export const MASKS = [
  {
    type: MaskTypes.RECTANGLE,
    name: __('Rectangle', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.RECTANGLE],
    ratio: 1,
  },
  {
    type: MaskTypes.CIRCLE,
    name: __('Circle', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.CIRCLE],
    ratio: 1,
  },
  {
    type: MaskTypes.TRIANGLE,
    name: __('Triangle', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.TRIANGLE],
    ratio: 1,
  },
  {
    type: MaskTypes.HEART,
    name: __('Heart', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.HEART],
    ratio: 1.075533375284871,
  },
  {
    type: MaskTypes.STAR,
    name: __('Star', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.STAR],
    ratio: 1.051524710830705,
  },
  {
    type: MaskTypes.PENTAGON,
    name: __('Pentagon', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.PENTAGON],
    ratio: 1.051524710830705,
  },
  {
    type: MaskTypes.HEXAGON,
    name: __('Hexagon', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.HEXAGON],
    ratio: 1.15473441108545,
  },
  {
    type: MaskTypes.BLOB,
    name: __('Blob', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.BLOB],
    ratio: 1,
  },
  {
    type: MaskTypes.CROSS,
    name: __('Cross', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.CROSS],
    ratio: 1,
  },
  {
    type: MaskTypes.ARROW,
    name: __('Arrow', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.ARROW],
    ratio: 1,
  },
  {
    type: MaskTypes.BURST,
    name: __('Burst', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.BURST],
    ratio: 1,
  },
];

export const DEFAULT_MASK = MASKS.find(
  (mask) => mask.type === MaskTypes.RECTANGLE
);

export function getElementMask({ type, mask }) {
  if (mask?.type) {
    return MASKS.find((m) => m.type === mask.type);
  }
  return getDefaultElementMask(type);
}

export function getMaskByType(type) {
  return MASKS.find((mask) => mask.type === type) || DEFAULT_MASK;
}

function getDefaultElementMask(type) {
  const { isMaskable } = getDefinitionForType(type);
  return isMaskable ? DEFAULT_MASK : null;
}
