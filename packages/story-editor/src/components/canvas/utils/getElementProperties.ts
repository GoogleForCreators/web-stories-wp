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
import STICKERS from '@googleforcreators/stickers';
import { dataPixels } from '@googleforcreators/units';
import {
  elementIs,
  ElementType,
  getDefinitionForType,
} from '@googleforcreators/elements';
import type { Element } from '@googleforcreators/elements';
import { DEFAULT_MASK } from '@googleforcreators/masks';

/**
 * Internal dependencies
 */
import getInsertedElementSize from '../../../utils/getInsertedElementSize';

function isNum(value: number | undefined) {
  return typeof value === 'number';
}

function getElementProperties(type: ElementType, element: Element) {
  let { x, y, width, height } = element;
  const { mask, rotationAngle = 0, ...rest } = element;
  const { isMaskable, isMedia } = getDefinitionForType(type);

  const attrs = { ...rest, type };
  let ratio = 1;
  let resource, scale, focalX, focalY, sticker;
  if (elementIs.sticker(element)) {
    sticker = element.sticker;
    ratio = STICKERS?.[sticker.type as keyof typeof STICKERS]?.aspectRatio;
  } else if (elementIs.media(element)) {
    resource = element.resource;
    ratio =
      isNum(resource.width) && isNum(resource.height)
        ? resource.width / resource.height
        : 1;
    scale = element.scale || 100;
    focalX = element.focalX || 50;
    focalY = element.focalY || 50;
  }

  // Width and height defaults. Width takes precedence.
  const size = getInsertedElementSize(
    type,
    width,
    height,
    attrs,
    ratio,
    resource
  );
  width = size.width;
  height = size.height;

  // X and y defaults: in the top corner of the page.
  if (!isNum(x)) {
    x = 48;
  }
  if (!isNum(y)) {
    y = 0;
  }

  x = dataPixels(x);
  y = dataPixels(y);

  const mediaProps = {
    focalX,
    focalY,
    resource,
    scale,
  };

  return {
    ...attrs,
    x,
    y,
    width,
    height,
    rotationAngle,
    ...(isMedia ? { ...mediaProps } : {}),
    ...(isMaskable
      ? {
          mask: mask || DEFAULT_MASK,
        }
      : {}),
    ...(sticker ? { sticker } : {}),
  };
}

export default getElementProperties;
