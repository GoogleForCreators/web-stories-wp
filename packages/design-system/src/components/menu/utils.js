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

export const getOptions = (groups) => {
  const isNested = groups.some((group) => Array.isArray(group?.options));
  if (isNested) {
    return groups.reduce((prev, current) => {
      // Determine if this nested group contains options as objects that contain a valid value key.
      const onlyValidOptions =
        current?.options &&
        current.options.filter(
          (option) => typeof option === 'object' && option?.value?.toString()
        );
      // If there aren't any valid options to return, just return the previously reduced array as is
      if (!Array.isArray(onlyValidOptions)) {
        return prev;
      }

      // Otherwise add the validated options to the reduced array as a new object containing group and label
      return prev.concat({
        group: onlyValidOptions,
        label: current?.label,
      });
    }, []);
  } else {
    // Double check that all data in groups should be treated as options to sanitize data
    const onlyValidOptions = groups.filter(
      (option) => typeof option === 'object' && option?.value
    );

    if (!Array.isArray(onlyValidOptions) || onlyValidOptions.length === 0) {
      return [];
    }
    return [{ group: onlyValidOptions }];
  }
};

export const getInset = (groups, i, j) =>
  groups
    .slice(0, i)
    .map(({ group }) => group.length)
    .reduce((a, b) => a + b, 0) + j;
