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
 * Internal dependencies
 */
import { HIDDEN_PADDING } from '../../../../constants';

/**
 * Applies hidden padding to element padding and sets the hidden
 * padding flag to true. returns entire element.padding object
 * while retaining existing properties on it.
 *
 * @param {Object} element - story element.
 * @return {Object} element.padding with hidden padding properties applied
 */
export function applyHiddenPadding(element) {
  return element?.padding?.hasHiddenPadding
    ? element.padding
    : {
        ...(element.padding ?? {}),
        hasHiddenPadding: true,
        ...['vertical', 'horizontal'].reduce((padding, axis) => {
          padding[axis] =
            (element?.padding?.[axis] || 0) + HIDDEN_PADDING[axis];
          return padding;
        }, {}),
      };
}

/**
 * Removes hidden padding on element padding and sets the hidden
 * padding flag to false. returns entire element.padding object
 * while retaining existing properties on it.
 *
 * @param {Object} element - story element.
 * @return {Object} element.padding with hidden padding properties removed
 */
export function removeHiddenPadding(element) {
  return element?.padding?.hasHiddenPadding
    ? {
        ...(element.padding ?? {}),
        hasHiddenPadding: false,
        ...['vertical', 'horizontal'].reduce((padding, axis) => {
          padding[axis] =
            (element?.padding?.[axis] || 0) - HIDDEN_PADDING[axis];
          return padding;
        }, {}),
      }
    : element.padding;
}

/**
 * Takes an element and a padding axis and returns the
 * hidden padding or 0 depending on elements `hasHiddenPadding`
 * flag.
 *
 * @param {Object} element - story element
 * @param {'horizontal' | 'vertical'} axis - requested padding axis
 * @return {number} - hidden padding value
 */
export function getHiddenPadding(element = {}, axis = 'horizontal') {
  return element?.padding?.hasHiddenPadding ? HIDDEN_PADDING[axis] : 0;
}
