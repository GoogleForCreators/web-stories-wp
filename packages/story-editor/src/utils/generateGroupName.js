/*
 * Copyright 2022 Google LLC
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
 * External dependencies
 */
import { __, sprintf } from '@googleforcreators/i18n';

export function getNextGroupNumber(groups) {
  const nums = [0];
  const defaultName = __('Group', 'web-stories');
  for (const prop in groups) {
    if (!Object.prototype.hasOwnProperty.call(groups[prop], 'name')) {
      continue;
    }
    const parts = groups[prop]?.name.split(' ');
    if (parts[0] === defaultName && parts[1]) {
      nums.push(Number(parts[1]));
    }
  }
  return Math.max(...nums) + 1;
}

function generateGroupName(groups, name) {
  if (!name) {
    const groupNumber = getNextGroupNumber(groups);
    return sprintf(
      /* translators: %d: group number. */
      __('Group %d', 'web-stories'),
      groupNumber
    );
  }

  return sprintf(
    /* translators: %s: name of layer. */
    __('%s Copy', 'web-stories'),
    name
  );
}

export default generateGroupName;
