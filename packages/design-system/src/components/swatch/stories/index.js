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
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { DarkThemeProvider } from '../../../storybookUtils';
import { Tooltip } from '../../tooltip';
import { Text } from '../../typography';
import { Cross, Pipette } from '../../../icons';
import { Swatch } from '../swatch';

const Container = styled.div`
  padding: 50px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border: 1px solid ${({ theme }) => theme.colors.standard.black};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 30% repeat(4, 15%);
  margin-bottom: 16px;
  text-align: right;
`;

const Cell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export default {
  title: 'DesignSystem/Components/Swatch',
  component: Swatch,
  args: {
    isDisabled: false,
  },
  parameters: {
    controls: {
      include: ['isDisabled'],
    },
  },
};

const DEMO_COLORS = [
  {
    label: 'Indeterminate',
    pattern: { color: { r: 0, g: 0, b: 255, a: 0 } },
    isIndeterminate: true,
  },
  {
    label: 'Fully transparent',
    pattern: { color: { r: 0, g: 0, b: 255, a: 0 } },
  },
  {
    label: 'Semi-transparent',
    pattern: { color: { r: 255, g: 0, b: 0, a: 0.5 } },
  },
  { label: 'Solid', pattern: { color: { r: 0, g: 255, b: 0, a: 1 } } },
  {
    label: 'Linear gradient',
    pattern: {
      type: 'linear',
      stops: [
        { color: { r: 0, g: 255, b: 255, a: 1 }, position: 0 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 1 },
      ],
    },
  },
  {
    label: 'Linear gradient with transparency',
    pattern: {
      type: 'linear',
      stops: [
        { color: { r: 0, g: 255, b: 0, a: 1 }, position: 0 },
        { color: { r: 255, g: 0, b: 255, a: 0.5 }, position: 1 },
      ],
      alpha: 0.7,
    },
  },
  {
    label: 'Linear gradient with rotation',
    pattern: {
      type: 'linear',
      stops: [
        { color: { r: 255, g: 255, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 1 },
      ],
      rotation: 0.375,
    },
  },
  {
    label: 'Radial gradient',
    pattern: {
      type: 'radial',
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 255, b: 255, a: 1 }, position: 1 },
      ],
    },
  },
  {
    label: 'Radial gradient with transparency',
    pattern: {
      type: 'radial',
      stops: [
        { color: { r: 255, g: 0, b: 255, a: 0.2 }, position: 0 },
        { color: { r: 255, g: 0, b: 255, a: 1 }, position: 0.4 },
        { color: { r: 0, g: 255, b: 255, a: 0.5 }, position: 1 },
      ],
      alpha: 0.9,
    },
  },
  {
    label: 'Radial gradient off-center',
    pattern: {
      type: 'radial',
      stops: [
        { color: { r: 255, g: 255, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 0.7 },
      ],
      center: { x: 0.3, y: 0.7 },
    },
  },
];

const VARIANTS = [
  {
    variant: 'Regular',
  },
  {
    variant: 'Disabled',
    isDisabled: true,
  },
  {
    variant: 'Icon',
    Icon: Cross,
  },
  {
    variant: 'Icon + disabled',
    Icon: Pipette,
    isDisabled: true,
  },
];

function _default(args) {
  return (
    <DarkThemeProvider>
      <Container>
        <Row>
          {/*We need an empty cell in the corner */}
          <Cell />
          {VARIANTS.map(({ variant }) => (
            <Cell key={variant}>
              <Text>{variant}</Text>
            </Cell>
          ))}
        </Row>
        {DEMO_COLORS.map(({ label, pattern, ...patternProps }) => (
          <Row key={label}>
            <Text>{label}</Text>
            {VARIANTS.map(({ variant, Icon, ...props }) => (
              <Cell key={variant}>
                <Swatch pattern={pattern} {...patternProps} {...props}>
                  {Icon && <Icon />}
                </Swatch>
              </Cell>
            ))}
          </Row>
        ))}
        <hr />
        {DEMO_COLORS.map(({ label, pattern, ...patternProps }) => (
          <Row key={`${label}_tooltip`}>
            <Text>{`${label} + tooltips`}</Text>
            {VARIANTS.map(({ variant, Icon, ...props }) => (
              <Tooltip title={variant} key={variant}>
                <Cell>
                  <Swatch
                    pattern={pattern}
                    {...args}
                    {...patternProps}
                    {...props}
                  >
                    {Icon && <Icon />}
                  </Swatch>
                </Cell>
              </Tooltip>
            ))}
          </Row>
        ))}
      </Container>
    </DarkThemeProvider>
  );
}

export { _default };
