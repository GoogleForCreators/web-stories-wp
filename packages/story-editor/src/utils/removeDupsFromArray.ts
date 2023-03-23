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
 * Removes duplicates of any objects from an array of objects
 *
 * @param arr Array object[].
 * @param key Key on the basis of which duplicates can be identified string.
 * @return If the page is equivalent to the default page.
 */
const removeDupsFromArray = (arr: Record<string, unknown>[], key: string) => {
  return arr.reduce(
    (acc: Record<string, unknown>[], current: Record<string, unknown>) => {
      const isCurrentTermAdded = acc.find(
        (term: Record<string, unknown>) => term[key] === current[key]
      );
      if (!isCurrentTermAdded) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    },
    []
  );
};

export default removeDupsFromArray;
