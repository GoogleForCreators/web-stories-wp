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
import { Text } from '..';
import { Headline } from '../..';
import { THEME_CONSTANTS, theme } from '../../../..';

const textTextSizes = THEME_CONSTANTS.TYPOGRAPHY.TEXT_SIZES;
const textRenderAsOptions = ['p', 'a', 'span'];

export default {
  title: 'DesignSystem/Components/Typography/Text',
  component: Text,
  arg: {
    as: 'p',
  },
  argTypes: {
    as: {
      options: textRenderAsOptions,
      control: 'radio',
      name: 'as HTML:',
    },
  },
  parameters: {
    controls: {
      include: ['as HTML:'],
    },
  },
};

export const _default = {
  render: function Render(args) {
    return (
      <>
        {textTextSizes.map((presetSize) => (
          <Text.Paragraph
            key={`${presetSize}_text`}
            size={presetSize}
            {...args}
          >
            {presetSize} <br />
            {
              'Duka din veranda till fest, för en långväga gäst, i landet lagom är bäst.'
            }
          </Text.Paragraph>
        ))}
      </>
    );
  },
};

export const Bold = {
  render: function Render(args) {
    return (
      <>
        {textTextSizes.map((presetSize) => (
          <Text.Paragraph
            key={`${presetSize}_text_bold`}
            size={presetSize}
            isBold
            {...args}
          >
            {presetSize} <br />
            {
              'Regnet slår mot rutorna nu, men natten är ljus, i ett land utan ljud'
            }
          </Text.Paragraph>
        ))}
      </>
    );
  },
};

export const Label = {
  render: function Render(args) {
    return (
      <>
        <Headline as="h1">{'Label'}</Headline>
        {textTextSizes.map((presetSize) => {
          return (
            theme.typography.presets.label[presetSize] && (
              <Text.Label
                key={`${presetSize}_text_link`}
                size={presetSize}
                {...args}
              >
                {`${presetSize} - Och glasen glittrar tyst på vårt bord`}
                <br />
              </Text.Label>
            )
          );
        })}
        <br />
        <Headline as="h1">{'Label - Disabled'}</Headline>
        {textTextSizes.map((presetSize) => {
          return (
            theme.typography.presets.label[presetSize] && (
              <Text
                key={`${presetSize}_text_link_disabled`}
                size={presetSize}
                as="label"
                disabled
                {...args}
              >
                {`${presetSize} - Och glasen glittrar tyst på vårt bord`}
                <br />
              </Text>
            )
          );
        })}
      </>
    );
  },

  args: {
    isBold: false,
  },

  parameters: {
    controls: {
      include: ['isBold'],
    },
  },
};
