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
export const createOptionFilter = (options) => (keyword) =>
  options.filter(({ name }) =>
    name.toLowerCase().includes(keyword.toLowerCase())
  );

export const isKeywordFilterable = (keyword) => keyword.trim().length >= 2;

export const getOptions = (groups) => groups.flatMap(({ options }) => options);

export const addUniqueEntries = (array, ...keys) => [
  ...new Set(array.concat(keys)),
];

export const getInset = (groups, i, j) =>
  groups
    .slice(0, i)
    .map((group) => group.options.length)
    .reduce((a, b) => a + b, 0) + j;
