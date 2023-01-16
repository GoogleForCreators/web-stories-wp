/*
 * Copyright 2021 Google LLC
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
import { __ } from '@googleforcreators/i18n';
import { ELEMENT_TYPES } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import * as textElement from './text';
import * as imageElement from './image';
import * as shapeElement from './shape';
import * as videoElement from './video';
import * as gifElement from './gif';
import * as stickerElement from './sticker';
import * as productElement from './product';

const elementTypes = [
  { type: ELEMENT_TYPES.TEXT, name: __('Text', 'web-stories'), ...textElement },
  {
    type: ELEMENT_TYPES.IMAGE,
    name: __('Image', 'web-stories'),
    ...imageElement,
  },
  {
    type: ELEMENT_TYPES.SHAPE,
    name: __('Shape', 'web-stories'),
    ...shapeElement,
  },
  {
    type: ELEMENT_TYPES.VIDEO,
    name: __('Video', 'web-stories'),
    ...videoElement,
  },
  { type: ELEMENT_TYPES.GIF, name: __('GIF', 'web-stories'), ...gifElement },
  {
    type: ELEMENT_TYPES.STICKER,
    name: __('Sticker', 'web-stories'),
    ...stickerElement,
  },
  {
    type: ELEMENT_TYPES.PRODUCT,
    name: __('Product', 'web-stories'),
    ...productElement,
  },
];

export default elementTypes;
