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
 * Internal dependencies
 */
import objectPick from '../../utils/objectPick';
import { ELEMENT_TYPES } from '../story';

const elementTypes = Object.values(ELEMENT_TYPES);

const MEDIA_STYLE_PROPERTIES = [
  'border',
  'borderRadius',
  'mask',
  'opacity',
  'overlay',
];

/**
 * Extracts the styles from an element based off of the element type.
 *
 * @param {Object} element the element
 * @return {Object} an object with a subset of properties of the original element. The properties
 * should all be properties that define styles on that element.
 */
export const getElementStyles = (element) => {
  if (!element || !element?.type || !elementTypes.includes(element.type)) {
    return null;
  }

  let properties = [];

  switch (element?.type) {
    case ELEMENT_TYPES.BACKGROUND:
      properties = ['backgroundColor', 'mask', 'opacity', 'overlay'];
      break;
    case ELEMENT_TYPES.GIF:
      properties = MEDIA_STYLE_PROPERTIES;
      break;
    case ELEMENT_TYPES.IMAGE:
      properties = MEDIA_STYLE_PROPERTIES;
      break;
    case ELEMENT_TYPES.SHAPE:
      properties = ['backgroundColor', 'border', 'borderRadius', 'opacity'];
      break;
    case ELEMENT_TYPES.TEXT:
      properties = [
        'backgroundColor',
        'backgroundTextMode',
        'border',
        'borderRadius',
        'font',
        'fontSize',
        'fontWeight',
        'lineHeight',
        'opacity',
        'padding',
        'textAlign',
      ];
      break;
    case ELEMENT_TYPES.VIDEO:
      properties = MEDIA_STYLE_PROPERTIES;
      break;
    default:
      break;
  }

  return objectPick(element, properties);
};
