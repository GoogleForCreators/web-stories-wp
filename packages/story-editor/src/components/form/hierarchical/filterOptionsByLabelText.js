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
 * Filters an option and its children based on the label text. Only returns an option iff:
 * 1. The option's label includes the `labelText`
 * 2. The label of a child of the option includes the `labelText`
 *
 * Returns a list with a new option. This option's children (and all nested children) will
 * also match the label text. If there are no children that match the label text then
 * no children will be returned.
 *
 * @param {Object} option The option to check
 * @param {string} labelText The text to match
 * @return {Array.<Object>} A filtered list of options
 */
export const filterOption = (option, labelText = '') => {
  const { options, ...rest } = option;
  let newChildren = [];

  // Find if any children match
  if (options) {
    for (let i = 0; i < options.length; i++) {
      newChildren = newChildren.concat(filterOption(options[i], labelText));
    }
  }

  // Find if current option matches
  const matchesCurrentOption = option.label
    .toLowerCase()
    .includes(labelText?.trim().toLowerCase());

  // create new option with new children
  const newOption = { ...rest, options: newChildren };

  // Return the filtered option if the current option matches or
  // if option has children that match the label text
  return matchesCurrentOption || newChildren.length ? [newOption] : [];
};

/**
 * Filters a list of options based on the label text. Only returns an option iff:
 * 1. The option's label includes the `labelText`
 * 2. The label of a child of the option includes the `labelText`
 *
 * @param {Array.<Object>} options The option to filter
 * @param {string} labelText The text to match
 * @return {Array.<Object>} A filtered list of options
 */
const filterOptionsByLabelText = (options, labelText) =>
  options.reduce(
    (all, option) => all.concat(filterOption(option, labelText)),
    []
  );

export default filterOptionsByLabelText;
