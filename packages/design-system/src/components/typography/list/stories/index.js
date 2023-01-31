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
import { List } from '..';
import { THEME_CONSTANTS } from '../../../..';

export default {
  title: 'DesignSystem/Components/Typography/List',
  component: List,
};

const textTextSizes = THEME_CONSTANTS.TYPOGRAPHY.TEXT_SIZES;

export const _default = () => (
  <>
    {textTextSizes.map((presetSize) => (
      <List key={`${presetSize}_text_list`} size={presetSize}>
        <li>{`${presetSize} - 1`}</li>
        <li>{`${presetSize} - 2`}</li>
        <li>{`${presetSize} - 3`}</li>
        <li>{`${presetSize} - 4`}</li>
      </List>
    ))}
  </>
);
