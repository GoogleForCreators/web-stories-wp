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
import { boolean, text, select } from '@storybook/addon-knobs';
import styled, { ThemeProvider } from 'styled-components';
/**
 * Internal dependencies
 */
import { theme } from '../../..';
import { Tooltip, TOOLTIP_POSITIONS } from '..';
import { Button, BUTTON_TYPES, BUTTON_VARIANTS } from '../../button';
import { List } from '../../../icons';

export default {
  title: 'DesignSystem/Components/Tooltip',
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 600px;
  height: 400px;
  background-color: ${(props) => props.theme.colors.bg.primary};
  padding: 30px;
`;

// const positionValues = {
//   left: 'left',
//   right: 'right',
//   center: 'center',
//   bottom_left: 'bottom_left',
//   bottom_right: 'bottom_right',
//   bottom_center: 'bottom_center',
//   top: 'top',
//   top_right: 'top_right',
//   top_left: 'top_left',
// };
// Override light theme because this component is only set up for dark theme right now given fg and bg coloring
export const _default = () => (
  <ThemeProvider theme={theme}>
    <Container>
      <div>
        <Tooltip
          position={select(
            'Position',
            TOOLTIP_POSITIONS,
            TOOLTIP_POSITIONS.LEFT
          )}
          content={text('tooltipContent', 'Tooltip Content')}
          hasTail={boolean('hasTail', true)}
        >
          <Button type={BUTTON_TYPES.PRIMARY} variant={BUTTON_VARIANTS.ICON}>
            <List aria-hidden={true} />
          </Button>
        </Tooltip>
      </div>
    </Container>
  </ThemeProvider>
);

export const LightMode = () => (
  <Container>
    <div>
      <Tooltip
        position={select('Position', TOOLTIP_POSITIONS)}
        content={text('tooltipContent', 'Tooltip Content')}
        hasTail={boolean('hasTail')}
      >
        <Button type={BUTTON_TYPES.PRIMARY} variant={BUTTON_VARIANTS.ICON}>
          <List aria-hidden={true} />
        </Button>
      </Tooltip>
    </div>
  </Container>
);
