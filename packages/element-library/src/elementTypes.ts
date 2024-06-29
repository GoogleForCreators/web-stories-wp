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
import {
  type ElementDefinition,
  type AudioStickerElement,
  type TextElement,
  type ImageElement,
  type ShapeElement,
  type VideoElement,
  type GifElement,
  type StickerElement,
  type ProductElement,
  ElementType,
} from '@googleforcreators/elements';

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
import * as audioStickerElement from './audioSticker';

const elementTypes = [
  {
    type: ElementType.Text,
    name: __('Text', 'web-stories'),
    ...textElement,
  } as ElementDefinition<TextElement>,
  {
    type: ElementType.Image,
    name: __('Image', 'web-stories'),
    ...imageElement,
  } as ElementDefinition<ImageElement>,
  {
    type: ElementType.Shape,
    name: __('Shape', 'web-stories'),
    ...shapeElement,
  } as ElementDefinition<ShapeElement>,
  {
    type: ElementType.Video,
    name: __('Video', 'web-stories'),
    ...videoElement,
  } as ElementDefinition<VideoElement>,
  {
    type: ElementType.Gif,
    name: __('GIF', 'web-stories'),
    ...gifElement,
  } as ElementDefinition<GifElement>,
  {
    type: ElementType.Sticker,
    name: __('Sticker', 'web-stories'),
    ...stickerElement,
  } as ElementDefinition<StickerElement>,
  {
    type: ElementType.Product,
    name: __('Product', 'web-stories'),
    ...productElement,
  } as ElementDefinition<ProductElement>,
  {
    type: ElementType.AudioSticker,
    name: __('Audio Sticker', 'web-stories'),
    ...audioStickerElement,
  } as ElementDefinition<AudioStickerElement>,
];

export default elementTypes;
