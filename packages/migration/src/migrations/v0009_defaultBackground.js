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

const PAGE_WIDTH = 1080;
const DEFAULT_ELEMENT_WIDTH = PAGE_WIDTH / 3;

function defaultBackground({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({
  elements,
  backgroundElementId,
  backgroundColor,
  ...rest
}) {
  if (!backgroundElementId) {
    const element = {
      type: 'shape',
      x: (PAGE_WIDTH / 4) * Math.random(),
      y: (PAGE_WIDTH / 4) * Math.random(),
      width: DEFAULT_ELEMENT_WIDTH,
      height: DEFAULT_ELEMENT_WIDTH,
      rotationAngle: 0,
      mask: {
        type: 'rectangle',
      },
      flip: {
        vertical: false,
        horizontal: false,
      },
      isBackground: true,
      backgroundColor: backgroundColor || {
        color: { r: 255, g: 255, b: 255, a: 1 },
      },
      id: uuidv4(),
    };
    elements.unshift(element);
    backgroundElementId = element.id;
  }
  return {
    backgroundElementId,
    elements,
    ...rest,
  };
}

export default defaultBackground;
