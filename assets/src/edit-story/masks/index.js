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
  BLOB_1: 'blob-1',
  BLOB_2: 'blob-2',
  BLOB_3: 'blob-3',
  BLOB_4: 'blob-4',
  BLOB_5: 'blob-5',
  BLOB_6: 'blob-6',
  BLOB_7: 'blob-7',
  BLOB_8: 'blob-8',
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
  [MaskTypes.BLOB_1]:
    'M 0.648438 0.285156 C 0.675781 0.347656 0.671875 0.410156 0.691406 0.472656 C 0.710938 0.535156 0.753906 0.601562 0.75 0.683594 C 0.75 0.761719 0.707031 0.851562 0.640625 0.867188 C 0.574219 0.882812 0.488281 0.828125 0.398438 0.789062 C 0.308594 0.75 0.21875 0.734375 0.175781 0.675781 C 0.128906 0.621094 0.132812 0.527344 0.148438 0.4375 C 0.160156 0.34375 0.191406 0.253906 0.25 0.195312 C 0.3125 0.132812 0.40625 0.105469 0.484375 0.128906 C 0.558594 0.148438 0.617188 0.21875 0.648438 0.285156 Z',
  [MaskTypes.BLOB_2]:
    'M 0.746094 0.214844 C 0.800781 0.253906 0.8125 0.347656 0.824219 0.441406 C 0.835938 0.53125 0.847656 0.621094 0.8125 0.675781 C 0.773438 0.730469 0.6875 0.75 0.601562 0.78125 C 0.515625 0.8125 0.433594 0.859375 0.351562 0.851562 C 0.273438 0.847656 0.191406 0.785156 0.171875 0.707031 C 0.148438 0.632812 0.183594 0.542969 0.21875 0.46875 C 0.253906 0.398438 0.289062 0.34375 0.335938 0.304688 C 0.382812 0.265625 0.441406 0.238281 0.519531 0.214844 C 0.597656 0.191406 0.691406 0.175781 0.746094 0.214844 Z',
  [MaskTypes.BLOB_3]:
    'M 0.777344 0.179688 C 0.84375 0.226562 0.878906 0.328125 0.894531 0.429688 C 0.914062 0.53125 0.914062 0.636719 0.867188 0.703125 C 0.816406 0.773438 0.71875 0.804688 0.621094 0.839844 C 0.527344 0.878906 0.429688 0.917969 0.339844 0.902344 C 0.25 0.886719 0.167969 0.8125 0.136719 0.726562 C 0.101562 0.636719 0.121094 0.535156 0.148438 0.449219 C 0.179688 0.363281 0.222656 0.292969 0.285156 0.242188 C 0.34375 0.195312 0.421875 0.167969 0.511719 0.152344 C 0.605469 0.136719 0.707031 0.132812 0.777344 0.179688 Z',
  [MaskTypes.BLOB_4]:
    'M 0.714844 0.179688 C 0.777344 0.207031 0.835938 0.265625 0.875 0.335938 C 0.914062 0.402344 0.9375 0.484375 0.917969 0.554688 C 0.898438 0.625 0.839844 0.683594 0.78125 0.730469 C 0.722656 0.78125 0.664062 0.816406 0.597656 0.835938 C 0.535156 0.859375 0.464844 0.859375 0.394531 0.847656 C 0.324219 0.832031 0.257812 0.800781 0.207031 0.75 C 0.15625 0.699219 0.125 0.628906 0.101562 0.550781 C 0.0820312 0.472656 0.0742188 0.386719 0.109375 0.324219 C 0.144531 0.265625 0.222656 0.230469 0.296875 0.203125 C 0.371094 0.175781 0.433594 0.160156 0.503906 0.152344 C 0.574219 0.144531 0.648438 0.148438 0.714844 0.179688 Z',
  [MaskTypes.BLOB_5]:
    'M 0.190 0.816 C 0.126 0.778 0.084 0.717 0.067 0.659 C 0.047 0.594 0.061 0.537 0.137 0.507 C 0.217 0.475 0.258 0.436 0.290 0.407 C 0.348 0.355 0.352 0.310 0.376 0.262 C 0.394 0.225 0.429 0.189 0.511 0.149 C 0.592 0.110 0.658 0.098 0.712 0.126 C 0.760 0.151 0.798 0.204 0.832 0.281 C 0.853 0.329 0.869 0.388 0.887 0.458 C 0.901 0.514 0.899 0.565 0.883 0.613 C 0.867 0.663 0.845 0.713 0.802 0.750 C 0.762 0.785 0.702 0.802 0.643 0.823 C 0.585 0.843 0.540 0.867 0.498 0.877 C 0.437 0.891 0.385 0.900 0.335 0.889 C 0.290 0.879 0.246 0.850 0.190 0.816 Z',
  [MaskTypes.BLOB_6]:
    'M 0.164 0.780 C 0.124 0.774 0.091 0.738 0.062 0.693 C 0.037 0.655 0.021 0.611 0.015 0.568 C 0.009 0.517 0.010 0.466 0.045 0.439 C 0.100 0.396 0.134 0.363 0.154 0.332 C 0.189 0.276 0.185 0.236 0.195 0.189 C 0.202 0.153 0.215 0.111 0.271 0.060 C 0.301 0.033 0.352 0.019 0.406 0.015 C 0.452 0.012 0.501 0.019 0.548 0.032 C 0.596 0.045 0.640 0.066 0.674 0.095 C 0.711 0.126 0.744 0.164 0.748 0.211 C 0.752 0.250 0.730 0.292 0.703 0.341 C 0.661 0.420 0.653 0.473 0.644 0.515 C 0.632 0.571 0.637 0.615 0.594 0.691 C 0.572 0.732 0.519 0.749 0.465 0.765 C 0.420 0.779 0.369 0.792 0.316 0.793 C 0.263 0.793 0.210 0.787 0.164 0.780 Z',
  [MaskTypes.BLOB_7]:
    'M 0.868 0.311 C 0.825 0.118 0.605 0.138 0.509 0.132 C 0.279 0.148 0.217 0.295 0.093 0.595 C -0.030 0.895 0.363 0.890 0.466 0.839 C 0.524 0.810 0.695 0.737 0.730 0.710 C 0.766 0.683 0.912 0.503 0.868 0.311 Z',
  [MaskTypes.BLOB_8]:
    'M 0.122 0.334 C 0.241 0.263 0.165 0.188 0.193 0.117 C 0.283 -0.162 0.619 0.117 0.744 0.334 C 0.869 0.550 0.674 0.688 0.549 0.764 C 0.425 0.840 0.395 0.784 0.311 0.670 C 0.226 0.556 0.076 0.623 0.024 0.539 C -0.028 0.454 0.004 0.404 0.122 0.334 Z',
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
    type: MaskTypes.BLOB_1,
    name: __('Blob 1', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.BLOB_1],
    ratio: 1,
  },
  {
    type: MaskTypes.BLOB_2,
    name: __('Blob 2', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.BLOB_2],
    ratio: 1,
  },
  {
    type: MaskTypes.BLOB_3,
    name: __('Blob 3', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.BLOB_3],
    ratio: 1,
  },
  {
    type: MaskTypes.BLOB_4,
    name: __('Blob 4', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.BLOB_4],
    ratio: 1,
  },
  {
    type: MaskTypes.BLOB_5,
    name: __('Blob 5', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.BLOB_5],
    ratio: 1,
  },
  {
    type: MaskTypes.BLOB_6,
    name: __('Blob 6', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.BLOB_6],
    ratio: 1,
  },
  {
    type: MaskTypes.BLOB_7,
    name: __('Blob 7', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.BLOB_7],
    ratio: 1,
  },
  {
    type: MaskTypes.BLOB_8,
    name: __('Blob 8', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.BLOB_8],
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
