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
import createSolid from '../utils/createSolid';
import * as textElement from './text';
import * as imageElement from './image';
import * as shapeElement from './shape';
import * as videoElement from './video';
import * as gifElement from './gif';

export const createNewElement = (type, attributes = {}) => {
  const element = getDefinitionForType(type);
  if (!element) {
    throw new Error(`Unknown element type: ${type}`);
  }
  const { defaultAttributes } = element;
  return {
    ...defaultAttributes,
    ...attributes,
    type,
    id: uuidv4(),
  };
};

export const createPage = (pageProps = null) => {
  const backgroundElementProps = {
    // The values of x, y, width, height are irrelevant here, however, need to be set.
    x: 1,
    y: 1,
    width: 1,
    height: 1,
    mask: {
      type: 'rectangle',
    },
    isBackground: true,
    isDefaultBackground: true,
  };
  const backgroundElement = createNewElement('shape', backgroundElementProps);

  const newAttributes = {
    elements: [backgroundElement],
    backgroundColor: createSolid(255, 255, 255),
    ...pageProps,
  };

  return createNewElement('page', newAttributes);
};

export const duplicatePage = (oldPage) => {
  const { elements: oldElements, ...rest } = oldPage;

  // Ensure all existing elements get new ids
  const elements = oldElements.map(({ type, ...attrs }) =>
    createNewElement(type, attrs)
  );
  const newAttributes = {
    elements,
    ...rest,
  };

  return createNewElement('page', newAttributes);
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
  { type: 'gif', name: __('Gif', 'web-stories'), ...gifElement },
];

export const getDefinitionForType = (type) =>
  elementTypes.find((el) => el.type === type);
