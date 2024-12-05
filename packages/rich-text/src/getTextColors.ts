/*
 * Copyright 2024 Google LLC
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
import {
  createSolid,
  getHexFromSolid,
  type Solid,
} from '@googleforcreators/patterns';

/**
 * Internal dependencies
 */
import { COLOR, NONE } from './customConstants';
import { getSelectAllStateFromHTML } from './htmlManipulation';
import { getPrefixStylesInSelection } from './styleManipulation';
import { styleToColor } from './formatters/util';

export default function getTextColors(html: string): string[] {
  const htmlState = getSelectAllStateFromHTML(html);
  return getPrefixStylesInSelection(htmlState, COLOR)
    .map((color) => {
      if (color === NONE) {
        return createSolid(0, 0, 0);
      }

      return styleToColor(color) as Solid;
    })
    .map(
      // To remove the alpha channel.
      (color) => '#' + getHexFromSolid(color).slice(0, 6)
    );
}
