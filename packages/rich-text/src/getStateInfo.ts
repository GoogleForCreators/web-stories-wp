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
 * External dependencies
 */
import type { EditorState } from 'draft-js';
import type { Pattern } from '@googleforcreators/patterns';

/**
 * Internal dependencies
 */
import formatters from './formatters';
import type { StateInfo } from './types';

type Getter = (state: EditorState) => boolean | string | number | Pattern;

function getStateInfo(state: EditorState): StateInfo {
  const stateInfo = formatters.reduce(
    (aggr, { getters }) => ({
      ...aggr,
      ...Object.fromEntries(
        Object.entries(getters).map(([key, getter]: [string, Getter]) => [
          key,
          getter(state),
        ])
      ),
    }),
    {}
  );
  return stateInfo;
}

export default getStateInfo;
