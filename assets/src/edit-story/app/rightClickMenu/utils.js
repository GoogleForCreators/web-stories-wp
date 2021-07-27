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
import { DEFAULT_PRESET } from '../../components/library/panes/text/textPresets';
import objectPick from '../../utils/objectPick';
import { ELEMENT_TYPES } from '../story';

const elementTypes = Object.values(ELEMENT_TYPES);

const { content, x, y, width, ...DEFAULT_TEXT_PRESETS } = DEFAULT_PRESET;

export const PROPERTY_DEFAULTS = {
  backgroundColor: { r: 255, g: 255, b: 255 },
  backgroundTextMode: 'NONE',
  border: null,
  borderRadius: null,
  opacity: 100,
  overlay: null,
  padding: {
    hasHiddenPadding: false,
    horizontal: 0,
    locked: true,
    vertical: 0,
  },
  textAlign: 'initial',
};

export const BACKGROUND_STYLE_PROPERTIES = [
  'backgroundColor',
  'mask',
  'opacity',
  'overlay',
];

export const MEDIA_STYLE_PROPERTIES = [
  'border',
  'borderRadius',
  'mask',
  'opacity',
  'overlay',
];

export const SHAPE_STYLE_PROPERTIES = [
  'backgroundColor',
  'border',
  'borderRadius',
  'opacity',
];

export const TEXT_STYLE_PROPERTIES = [
  'backgroundColor',
  'backgroundTextMode',
  'border',
  'borderRadius',
  'opacity',
  'padding',
  'textAlign',
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
      properties = BACKGROUND_STYLE_PROPERTIES;
      break;
    case ELEMENT_TYPES.GIF:
      properties = MEDIA_STYLE_PROPERTIES;
      break;
    case ELEMENT_TYPES.IMAGE:
      properties = MEDIA_STYLE_PROPERTIES;
      break;
    case ELEMENT_TYPES.SHAPE:
      properties = SHAPE_STYLE_PROPERTIES;
      break;
    case ELEMENT_TYPES.TEXT:
      properties = TEXT_STYLE_PROPERTIES;
      break;
    case ELEMENT_TYPES.VIDEO:
      properties = MEDIA_STYLE_PROPERTIES;
      break;
    default:
      break;
  }

  return objectPick(element, properties);
};

/**
 *
 * @param {Object} element the element to update
 * @param {Object} element.type the type of the element to update
 * @return {Object|null} the default properties for the element type.
 * return `null` if the argument has an incorrect type.
 */
export const getDefaultProperties = ({ type }) => {
  switch (type) {
    case ELEMENT_TYPES.BACKGROUND:
      return objectPick(PROPERTY_DEFAULTS, BACKGROUND_STYLE_PROPERTIES);
    case ELEMENT_TYPES.GIF:
    case ELEMENT_TYPES.IMAGE:
    case ELEMENT_TYPES.VIDEO:
      return objectPick(PROPERTY_DEFAULTS, MEDIA_STYLE_PROPERTIES);
    case ELEMENT_TYPES.SHAPE:
      return objectPick(PROPERTY_DEFAULTS, SHAPE_STYLE_PROPERTIES);
    case ELEMENT_TYPES.TEXT:
      return DEFAULT_TEXT_PRESETS;
    default:
      return null;
  }
};

export { DEFAULT_TEXT_PRESETS };
