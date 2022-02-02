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
 * Copies the styles and animations of the element specified by `elementId`
 * on the current page.
 *
 * If given `elementId` doesn't match an element's id, do nothing.
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {string} payload.elementId id of elements to copy.
 * @return {Object} New state
 */
function copyElementById(state, { elementId }) {
  // Do nothing if no elementId
  if (!elementId) {
    return state;
  }

  const page = state.pages.find(({ id }) => id === state.current);

  const elementIndex = page.elements.findIndex(({ id }) => id === elementId);

  // Do nothing if element does not exist on the current page
  if (!elementIndex) {
    return state;
  }

  const element = page.elements[elementIndex];

  // find related animations
  const elementAnimations = (page.animations || []).filter(({ targets }) =>
    targets.includes(element.id)
  );

  // omit properties that must not be copied
  const copiedStyles = objectPick(element, ATTRIBUTES_TO_COPY);

  return {
    ...state,
    copiedElementState: {
      animations: elementAnimations,
      styles: copiedStyles,
      type: element.type,
    },
  };
}

export default copyElementById;
