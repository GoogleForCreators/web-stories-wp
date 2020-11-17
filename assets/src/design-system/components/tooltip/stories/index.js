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
import { theme } from '../../../theme';
import { List } from '../../../icons';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from '../../button';
import { TOOLTIP_POSITIONS } from '../constants';
import { Tooltip } from '..';

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

// Override light theme because this component is only set up for dark theme right now given fg and bg coloring
export const _default = () => (
  <ThemeProvider theme={theme}>
    <Container>
      <div>
        <Tooltip
          position={select(
            'Tooltip for icon - position',
            TOOLTIP_POSITIONS,
            TOOLTIP_POSITIONS.BOTTOM_CENTER
          )}
          content={text('Tooltip for icon - content', 'Tooltip Content')}
          hasTail={boolean('Tooltip for icon - hasTail', true)}
        >
          <Button type={BUTTON_TYPES.PRIMARY} variant={BUTTON_VARIANTS.ICON}>
            <List aria-hidden={true} />
          </Button>
        </Tooltip>
      </div>

      <div>
        <Tooltip
          position={select(
            'Tooltip for button - position',
            TOOLTIP_POSITIONS,
            TOOLTIP_POSITIONS.BOTTOM_CENTER
          )}
          content={text('Tooltip for button - content', 'Tooltip Content')}
          hasTail={boolean('Tooltip for button - hasTail')}
        >
          <Button type={BUTTON_TYPES.PRIMARY} size={BUTTON_SIZES.SMALL}>
            {'I am just a normal button'}
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
        position={select(
          'Tooltip for icon - position',
          TOOLTIP_POSITIONS,
          TOOLTIP_POSITIONS.BOTTOM_CENTER
        )}
        content={text('Tooltip for icon - content', 'Tooltip Content')}
        hasTail={boolean('Tooltip for icon - hasTail', true)}
      >
        <Button type={BUTTON_TYPES.PRIMARY} variant={BUTTON_VARIANTS.ICON}>
          <List aria-hidden={true} />
        </Button>
      </Tooltip>
    </div>

    <div>
      <Tooltip
        position={select(
          'Tooltip for button - position',
          TOOLTIP_POSITIONS,
          TOOLTIP_POSITIONS.BOTTOM_CENTER
        )}
        content={text('Tooltip for button - content', 'Tooltip Content')}
        hasTail={boolean('Tooltip for button - hasTail')}
      >
        <Button type={BUTTON_TYPES.PRIMARY} size={BUTTON_SIZES.SMALL}>
          {'I am just a normal button'}
        </Button>
      </Tooltip>
    </div>
  </Container>
);
