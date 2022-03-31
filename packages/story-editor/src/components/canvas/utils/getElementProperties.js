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
import { getDefinitionForType } from '@googleforcreators/elements';
import { DEFAULT_MASK } from '@googleforcreators/masks';

/**
 * Internal dependencies
 */
import getInsertedElementSize from '../../../utils/getInsertedElementSize';

/**
 * @param {?number|undefined} value The value.
 * @return {boolean} Whether the value has been set.
 */
function isNum(value) {
  return typeof value === 'number';
}

/**
 * @param {string} type Element type.
 * @param {!Object} props The element's properties.
 * @param {number} props.width The element's width.
 * @param {number} props.height The element's height.
 * @param {?Object} props.mask The element's mask.
 * @return {Object} The element properties.
 */
function getElementProperties(
  type,
  {
    resource,
    x,
    y,
    width,
    height,
    mask,
    rotationAngle = 0,
    scale = 100,
    focalX = 50,
    focalY = 50,
    sticker,
    ...rest
  }
) {
  const { isMaskable } = getDefinitionForType(type);

  const attrs = { type, ...rest };

  const stickerRatio = sticker && STICKERS?.[sticker?.type]?.aspectRatio;

  // Width and height defaults. Width takes precedence.
  const ratio =
    resource && isNum(resource.width) && isNum(resource.height)
      ? resource.width / resource.height
      : 1;
  const size = getInsertedElementSize(
    type,
    width,
    height,
    attrs,
    stickerRatio || ratio,
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

  return {
    ...attrs,
    resource,
    x,
    y,
    width,
    height,
    rotationAngle,
    scale,
    focalX,
    focalY,
    ...(isMaskable
      ? {
          mask: mask || DEFAULT_MASK,
        }
      : {}),
    ...(sticker ? { sticker } : {}),
  };
}

export default getElementProperties;
