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
// import { Placement } from '../constants';
import { Placement } from '../../popup';
import WithTooltip from '..';

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

const Color = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: red;
`;

export const _default = () => (
  <ThemeProvider theme={theme}>
    <Container>
      <WithTooltip
        title={text(
          'Tooltip for color - content',
          'Page background colors cannot have opacity'
        )}
        hasTail={boolean('Tooltip for color - hasTail', true)}
        placement={select(
          'Tooltip for color - position',
          Placement,
          Placement.BOTTOM
        )}
      >
        <Color />
      </WithTooltip>

      <WithTooltip
        title={text('Tooltip for icon - content', 'To save draft click enter')}
        hasTail={boolean('Tooltip for icon - hasTail', true)}
        placement={select(
          'Tooltip for icon - position',
          Placement,
          Placement.BOTTOM
        )}
      >
        <Button type={BUTTON_TYPES.PRIMARY} variant={BUTTON_VARIANTS.ICON}>
          <List aria-hidden={true} />
        </Button>
      </WithTooltip>

      <WithTooltip
        title={text(
          'Tooltip for standard button - content',
          'Tooltip message over a button'
        )}
        hasTail={boolean('Tooltip for standard button - hasTail', true)}
        placement={select(
          'Tooltip for standard button - position',
          Placement,
          Placement.BOTTOM
        )}
      >
        <Button type={BUTTON_TYPES.PRIMARY} size={BUTTON_SIZES.SMALL}>
          {'I am just a normal button'}
        </Button>
      </WithTooltip>
    </Container>
  </ThemeProvider>
);

// export const LightMode = () => (
//   <Container>
//     <div>
//       <Tooltip
//         content={text('Tooltip for icon - content', 'Tooltip Content')}
//         hasTail={boolean('Tooltip for icon - hasTail', true)}
//         position={select(
//           'Tooltip for icon - position',
//           Placement,
//           Placement.BOTTOM
//         )}
//       >
//         <Button type={BUTTON_TYPES.PRIMARY} variant={BUTTON_VARIANTS.ICON}>
//           <List aria-hidden={true} />
//         </Button>
//       </Tooltip>
//     </div>

//     <div>
//       <Tooltip
//         content={text('Tooltip for button - content', 'Tooltip Content')}
//         hasTail={boolean('Tooltip for button - hasTail')}
//         position={select(
//           'Tooltip for button - position',
//           Placement,
//           Placement.BOTTOM
//         )}
//       >
//         <Button type={BUTTON_TYPES.PRIMARY} size={BUTTON_SIZES.SMALL}>
//           {'I am just a normal button'}
//         </Button>
//       </Tooltip>
//     </div>
//   </Container>
// );
