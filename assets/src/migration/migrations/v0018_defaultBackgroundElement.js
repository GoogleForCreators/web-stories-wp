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

function createDefaultBackgroundElement({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, backgroundElementId, ...rest }) {
  const backgroundElement = elements[0];
  let extra = {};
  if (backgroundElement.type === 'shape') {
    backgroundElement.isDefaultBackground = true;
  } else {
    extra = {
      defaultBackgroundElement: {
        type: 'shape',
        x: 1,
        y: 1,
        width: 1,
        height: 1,
        rotationAngle: 0,
        mask: {
          type: 'rectangle',
        },
        backgroundColor: {
          color: { r: 255, g: 255, b: 255, a: 1 },
        },
        isBackground: true,
        isDefaultBackground: true,
        id: uuidv4(),
      },
    };
  }
  // Note that we're not including `backgroundElementId` here
  return {
    elements,
    ...rest,
    ...extra,
  };
}

export default createDefaultBackgroundElement;
