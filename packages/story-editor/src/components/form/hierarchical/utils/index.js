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
 * Creates an object composed of keys generated from the
 * values of the `key` in each object.
 *
 * @param {Array.<Object>} arr The array to iterate over
 * @param {string|number|undefined|null|boolean} key The key used to group the array items.
 * @return {Object} The composed object
 */
const groupBy = (arr, key) =>
  arr.reduce((prev, arrItem) => {
    if (prev[arrItem[key]]) {
      prev[arrItem[key]].push(arrItem);
    } else {
      prev[arrItem[key]] = [arrItem];
    }
    return prev;
  }, {});

/**
 * Composes a tree from an array of options that are related.
 * Can be parents or children as defined by the `parent` key.
 *
 * @param {Object} groupedOptionsByParent A object of options grouped by parent key.
 * @param {Array.<Object>} options A flat array of options.
 * @return {Array.<Object>} A tree of options
 */
const fillTree = (groupedOptionsByParent, options = []) => {
  return options.map((option) => {
    const children = groupedOptionsByParent[option.id];

    return {
      ...option,
      options:
        children && children.length
          ? fillTree(groupedOptionsByParent, children)
          : [],
    };
  });
};

/**
 * Returns options in a tree form.
 *
 * Works similarly to Gutenberg Editor:
 * https://github.com/WordPress/gutenberg/blob/3f9968e2815cfb56684c1acc9a2700d8e4a02726/packages/editor/src/utils/terms.js#L13-L40
 *
 * @param {Array} flatOptions Array of terms in flat format.
 * @return {Array} Array of terms in tree format.
 */
export const buildOptionsTree = (flatOptions) => {
  const formattedOptions = flatOptions.map((option) => ({
    options: [],
    // Categories with no parent will have a parent id of 0
    parent: 0,
    ...option,
  }));

  const groupedOptionsByParent = groupBy(formattedOptions, 'parent');

  return fillTree(groupedOptionsByParent, groupedOptionsByParent[0]);
};

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
    .includes(labelText.trim().toLowerCase());

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
export const filterOptionsByLabelText = (options, labelText) =>
  options.reduce(
    (all, option) => all.concat(filterOption(option, labelText)),
    []
  );

/**
 * Recursively count the number of `options` in an array of nested objects.
 *
 * @param {Array.<Object>} option Array of options to count
 * @return {number} the count of all options
 */
const countOptions = (option) => {
  if (!option?.options?.length) {
    return 1;
  }

  return (
    1 + option.options.reduce((sum, child) => sum + countOptions(child), 0)
  );
};

/**
 * Recursively count the number of `options` in an array of nested objects.
 *
 * @param {Array.<Object>} tree Array of options to count.
 * @return {number} the count of all options
 */
export const getOptionCount = (tree = []) =>
  tree.reduce((count, option) => count + countOptions(option), 0);
