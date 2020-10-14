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
import { Headline } from '..';
import { THEME_CONSTANTS } from '../../../theme';

export default {
  title: 'DesignSystem/Typography/Headline',
  component: Headline,
};

const headlinePresetSizes = THEME_CONSTANTS.HEADLINE_SIZES;
const headlineRenderAsOptions = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

export const _default = () => (
  <>
    {headlinePresetSizes.map((presetSize, idx) => (
      <Headline
        key={idx}
        size={presetSize}
        as={select('as', headlineRenderAsOptions, 'h1')}
      >
        {presetSize} {'- The Quick Brown Fox Jumps Over the Lazy Dog'}
      </Headline>
    ))}
  </>
);
