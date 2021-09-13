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

export function objectFromEntries(entries = []) {
  return entries.reduce((acc, [key, val]) => {
    acc[key] = val;
    return acc;
  }, {});
}

export function mapObjectVals(obj = {}, op = (v) => v) {
  return objectFromEntries(
    Object.entries(obj).map(([key, val]) => [key, op(val)])
  );
}

export function mapObjectKeys(obj = {}, op = (v) => v) {
  return objectFromEntries(
    Object.entries(obj).map(([key, val]) => [op(key), val])
  );
}

export function mergeObjects(
  objA = {},
  objB = {},
  mergeVals = (valA, valB) => ({ ...valA, ...valB })
) {
  return Object.entries(objA).reduce((merge, [key, val]) => {
    merge[key] = mergeVals(val, merge[key]);
    return merge;
  }, objB);
}

export function dictonaryOnKey(arr, key) {
  return arr.reduce((map, item) => {
    map[item[key]] = item;
    return map;
  }, {});
}

export function cacheFromEmbeddedTerms(embeddedTerms = []) {
  return embeddedTerms.reduce((cache, taxonomy) => {
    (taxonomy || []).forEach((term) => {
      cache[term.taxonomy] = cache[term.taxonomy] || {};
      cache[term.taxonomy][term.slug] = term;
    });
    return cache;
  }, {});
}
