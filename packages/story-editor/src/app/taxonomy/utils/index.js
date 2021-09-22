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
 * Takes an array of key value tuples and
 * returns an object.
 *
 * @param {Array.<[string, any]>} entries an array of key value tuples
 * @return {Object} the created object
 */
export function objectFromEntries(entries = []) {
  return entries.reduce((acc, [key, val]) => {
    acc[key] = val;
    return acc;
  }, {});
}

/**
 * Takes an object and maps over all values performing
 * an operation and returning a new object
 *
 * @param {Object} obj object to map over the values of
 * @param {Function} op operation to be performed on every value
 * @return {Object} new object with transformed values
 */
export function mapObjectVals(obj = {}, op = (v) => v) {
  return objectFromEntries(
    Object.entries(obj).map(([key, val]) => [key, op(val)])
  );
}

/**
 * Takes an object and maps over all keys performing
 * an operation and returning a new object
 *
 * @param {Object} obj object to map over the keys of
 * @param {Function} op operation to be performed on every key
 * @return {Object} new object with transformed keys
 */
export function mapObjectKeys(obj = {}, op = (v) => v) {
  return objectFromEntries(
    Object.entries(obj).map(([key, val]) => [op(key), val])
  );
}

/**
 * Merges two object who have children that can't be
 * merged by spreading both objects into a new object.
 *
 * Creates an object with a union of both keys
 * and a merge operation performed where both
 * object have a value for the same key
 *
 * @param {Object} dictA nested dictionary
 * @param {Object} dictB nested dictionary
 * @return {Object} new unified nested dictionary
 */
export function mergeNestedDictionaries(dictA = {}, dictB = {}) {
  return Object.entries(dictA).reduce(
    (merged, [key, val]) => {
      merged[key] = { ...val, ...merged[key] };
      return merged;
    },
    { ...dictB }
  );
}

/**
 * Takes an array of objects of the same shape
 * and creates a dictionary keyed on the specified
 * property.
 *
 * @param {Array.<Object>} arr array of objects
 * @param {string} key key used to index poperty to be keyed on
 * @return {Object} new object
 */
export function dictionaryOnKey(arr = [], key) {
  return arr.reduce((map, item) => {
    map[item[key]] = item;
    return map;
  }, {});
}

/**
 * Takes embedded wp:terms from the story object and creates a
 * nested dictionary in the form of { [taxonomy.slug]: { [term.slug]: term } }
 *
 * @param {Array.<Object[]>} embeddedTerms embedded wp:terms
 * @return {Object} a nested dictionary of { [taxonomy.slug]: { [term.slug]: term } }
 */
export function cacheFromEmbeddedTerms(embeddedTerms = []) {
  return embeddedTerms.reduce((cache, taxonomy) => {
    (taxonomy || []).forEach((term) => {
      cache[term.taxonomy] = cache[term.taxonomy] || {};
      cache[term.taxonomy][term.slug] = term;
    });
    return cache;
  }, {});
}
