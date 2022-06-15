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
import { produce } from 'immer';

/**
 * Internal dependencies
 */
import objectPick from '../../../../utils/objectPick';

export const ATTRIBUTES_TO_COPY = [
  'background',
  'backgroundColor',
  'backgroundTextMode',
  'border',
  'borderRadius',
  'content',
  'flip',
  'font',
  'fontSize',
  'lineHeight',
  'lockAspectRatio',
  'opacity',
  'overlay',
  'padding',
  'rotationAngle',
  'textAlign',
];

/**
 * Copies the styles and animations of the selected element
 * on the current page.
 *
 * @param {Object} state Current state
 * @return {Object} New state
 */
const copySelectedElement = produce((draft) => {
  // we can only copy one element and it has to exist
  if (draft.selection?.length !== 1 || !draft.selection[0]) {
    return;
  }

  const page = draft.pages.find(({ id }) => id === draft.current);
  const element = page.elements.find(({ id }) => id === draft.selection[0]);

  // Do nothing if element does not exist on the current page
  if (!element) {
    return;
  }

  // find related animations
  const elementAnimations = (page.animations || []).filter(({ targets }) =>
    targets.includes(element.id)
  );

  // omit properties that must not be copied
  const copiedStyles = objectPick(element, ATTRIBUTES_TO_COPY);

  draft.copiedElementState = {
    animations: elementAnimations,
    styles: copiedStyles,
    type: element.type,
  };
});

export default copySelectedElement;
