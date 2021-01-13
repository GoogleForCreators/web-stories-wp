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
import { MULTIPLE_VALUE } from '../../../constants';

/**
 * Get the common value `property` for all objects in `list`, if they
 * in fact are all the same. If they are not all equal, return an empty string.
 *
 * Example usage:
 *
 * ```
 * getCommonValue( [ { a: 1 }, { a:  1  } ], 'a' );  // returns: 1
 * getCommonValue( [ { a: 1 }, {        } ], 'a' );  // returns: MULTIPLE_VALUE
 * getCommonValue( [ { a: 1 }, { a:  2  } ], 'a' );  // returns: MULTIPLE_VALUE
 * getCommonValue( [ { a: 1 }, { a: '1' } ], 'a' );  // returns: MULTIPLE_VALUE
 * ```
 *
 * @param {Array<Object>} list List of objects
 * @param {string|function(Object):any} propertyOrFunc Property to check on all objects.
 * @param {any} def The default value.
 * @return {any} Returns common value or empty string if not similar
 */
function getCommonValue(list, propertyOrFunc, def = undefined) {
  const func =
    typeof propertyOrFunc === 'function'
      ? propertyOrFunc
      : (item) => item[propertyOrFunc];
  const first = ifDef(func(list[0]), def);
  const allMatch = list.every((el) => ifDef(func(el), def) === first);
  return allMatch ? first : MULTIPLE_VALUE;
}

function ifDef(value, def) {
  return value === undefined ? def : value;
}

export default getCommonValue;
