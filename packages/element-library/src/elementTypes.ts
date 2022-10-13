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
import type { Element, ElementDefinition } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import textElement from './text';
import imageElement from './image';
import shapeElement from './shape';
import videoElement from './video';
import gifElement from './gif';
import stickerElement from './sticker';
import productElement from './product';

const elementTypes: ElementDefinition<Element>[] = [
  { type: 'text', name: __('Text', 'web-stories'), ...textElement },
  { type: 'image', name: __('Image', 'web-stories'), ...imageElement },
  { type: 'shape', name: __('Shape', 'web-stories'), ...shapeElement },
  { type: 'video', name: __('Video', 'web-stories'), ...videoElement },
  { type: 'gif', name: __('GIF', 'web-stories'), ...gifElement },
  { type: 'sticker', name: __('Sticker', 'web-stories'), ...stickerElement },
  { type: 'product', name: __('Product', 'web-stories'), ...productElement },
];

export default elementTypes;
