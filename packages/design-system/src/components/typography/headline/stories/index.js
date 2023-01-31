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
 * Internal dependencies
 */
import { THEME_CONSTANTS } from '../../../..';
import { Text } from '../..';
import { Headline } from '..';

const headlineTextSizes = THEME_CONSTANTS.TYPOGRAPHY.HEADLINE_SIZES;
const headlineRenderAsOptions = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

export default {
  title: 'DesignSystem/Components/Typography/Headline',
  component: Headline,
  arg: {
    as: 'h1',
  },
  argTypes: {
    as: {
      options: headlineRenderAsOptions,
      control: 'select',
      name: 'as HTML:',
    },
  },
};

export const _default = (args) => (
  <>
    {headlineTextSizes.map((presetSize) => (
      <div key={`${presetSize}_headline`}>
        <Text.Paragraph size={'small'}>{presetSize}</Text.Paragraph>
        <Headline size={presetSize} {...args}>
          {'The Quick Brown Fox Jumps Over the Lazy Dog'}
        </Headline>
      </div>
    ))}
  </>
);
