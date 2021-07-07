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
 * @typedef {Object} ObjectOperationProps
 * @property {Object} obj Object to perfrom operation on
 * @property {Array<string>} keys Array of keys to perform operation with
 */

/**
 * Creates new object from the original object excluding
 * properties from specified keys.
 *
 * @param {ObjectOperationProps} props `{obj, keys}`
 * @return {Object} Input object with exluding keys
 */
export function getExclusion({ obj = {}, keys = [] }) {
  return Object.keys(obj).reduce((exclusionObj, key) => {
    if (!keys.includes(key)) {
      exclusionObj[key] = obj[key];
    }
    return exclusionObj;
  }, {});
}

/**
 * Takes an object and an array of keys that specify how to order
 * properties.
 *
 * If the keys don't appear in the input object, they
 * won't appear in the resulting object.
 *
 * Any properties absent from the keys input will appear in same order
 * as original object properties, but after specified order keys.
 *
 * @param {ObjectOperationProps} props `{obj, keys}`
 * @return {Object} Input object with ordered keys
 */
export function orderByKeys({ obj = {}, keys = [] }) {
  return {
    ...keys.reduce((keyOrderedObj, key) => {
      const val = obj[key];
      if (key in obj) {
        keyOrderedObj[key] = val;
      }
      return keyOrderedObj;
    }, {}),
    ...getExclusion({ obj, keys }),
  };
}
