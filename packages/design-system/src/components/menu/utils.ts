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
import type { DropdownItem, NestedDropdownItem } from './types';

function isValid(opt: DropdownItem) {
  return typeof opt === 'object' && String(opt.value);
}

export function getGroups(
  source: NestedDropdownItem[] | DropdownItem[]
): NestedDropdownItem[] {
  if (source.length === 0) {
    return [];
  }
  const isNested = source.some((opt) => 'options' in opt);
  if (isNested) {
    const nestedOptions = source as NestedDropdownItem[];
    return nestedOptions
      .map((group) => ({
        ...group,
        options: group.options.filter(isValid),
      }))
      .filter(({ options }) => options.length > 0);
  }

  // Double check that all data in groups should be treated as options to sanitize data
  const options = (source as DropdownItem[]).filter(isValid);
  return options.length ? [{ options }] : [];
}

export function getInset(
  groups: NestedDropdownItem[],
  i: number,
  j: number
): number {
  return (
    groups
      .slice(0, i)
      .map(({ options }) => options.length)
      .reduce((a: number, b: number) => a + b, 0) + j
  );
}
