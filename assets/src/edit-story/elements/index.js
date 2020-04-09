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
 * External dependencies
 */
import { v4 as uuidv4 } from 'uuid';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { PAGE_HEIGHT, PAGE_WIDTH } from '../constants';
import * as textElement from './text';
import * as imageElement from './image';
import * as shapeElement from './shape';
import * as videoElement from './video';

export const createNewElement = (type, attributes = {}) => {
  const element = elementTypes.find((el) => el.type === type);
  const defaultAttributes = element ? element.defaultAttributes : {};
  return {
    ...defaultAttributes,
    ...attributes,
    type,
    id: uuidv4(),
  };
};

export const createPage = (attributes = {}) => {
  const { elements, backgroundElementId } = attributes;
  // Enforce having background element for each Page.
  if (!backgroundElementId) {
    const props = {
      x: PAGE_WIDTH / 4,
      y: PAGE_HEIGHT / 4,
      width: PAGE_WIDTH / 3,
      height: PAGE_HEIGHT / 3,
      mask: {
        type: 'rectangle',
      },
      isBackground: true,
    };
    const backgroundElement = createNewElement('shape', props);
    attributes.elements = elements
      ? [backgroundElement, ...elements]
      : [backgroundElement];
    attributes.backgroundElementId = backgroundElement.id;
  }
  return createNewElement('page', attributes);
};

export const elementTypes = [
  {
    type: 'page',
    defaultAttributes: {},
    name: __('Page', 'web-stories'),
  },
  { type: 'text', name: __('Text', 'web-stories'), ...textElement },
  { type: 'image', name: __('Image', 'web-stories'), ...imageElement },
  { type: 'shape', name: __('Shape', 'web-stories'), ...shapeElement },
  { type: 'video', name: __('Video', 'web-stories'), ...videoElement },
];

export const getDefinitionForType = (type) =>
  elementTypes.find((el) => el.type === type);
