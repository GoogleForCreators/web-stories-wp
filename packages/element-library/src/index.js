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
import { __ } from '@web-stories-wp/i18n';
import { registerElementType } from '@web-stories-wp/elements';

/**
 * Internal dependencies
 */
import * as textElement from './text';
import * as imageElement from './image';
import * as shapeElement from './shape';
import * as videoElement from './video';
import * as gifElement from './gif';
import * as stickerElement from './sticker';

export * from './types';

export function registerElementTypes() {
  registerElementType({
    type: 'page',
    defaultAttributes: {},
    name: __('Page', 'web-stories'),
  });

  registerElementType({
    type: 'text',
    name: __('Text', 'web-stories'),
    ...textElement,
  });

  registerElementType({
    type: 'image',
    name: __('Image', 'web-stories'),
    ...imageElement,
  });

  registerElementType({
    type: 'shape',
    name: __('Shape', 'web-stories'),
    ...shapeElement,
  });

  registerElementType({
    type: 'video',
    name: __('Video', 'web-stories'),
    ...videoElement,
  });

  registerElementType({
    type: 'gif',
    name: __('Gif', 'web-stories'),
    ...gifElement,
  });

  registerElementType({
    type: 'sticker',
    name: __('Sticker', 'web-stories'),
    ...stickerElement,
  });
}
