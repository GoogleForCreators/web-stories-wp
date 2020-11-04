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
import { select } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import { THEME_CONSTANTS } from '../../../..';
import { Text } from '../../';
import { Display } from '..';

export default {
  title: 'DesignSystem/Components/Typography/Display',
  component: Display,
};

const displayPresetSizes = THEME_CONSTANTS.DISPLAY_SIZES;
const displayRenderAsOptions = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

export const _default = () => (
  <>
    {displayPresetSizes.map((presetSize) => (
      <div key={`${presetSize}_display`}>
        <Text size={'small'}>{presetSize}</Text>

        <Display
          size={presetSize}
          as={select('as', displayRenderAsOptions, 'h1')}
        >
          {'The Quick Brown Fox Jumps Over the Lazy Dog'} <br />
        </Display>
      </div>
    ))}
  </>
);
