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
import { useState } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
/**
 * Internal dependencies
 */
import { theme } from '../../../theme';
import { Pill, PillGroup } from '..';

export default {
  title: 'DesignSystem/Components/Pill',
  args: {
    pill1: 'pill 1 text',
    pill2: 'pill 2 text',
    pill3: 'pill 3 text',
    pill1isActive: true,
    pill2isActive: true,
    pill3isActive: true,
  },
  argTypes: {
    pill1: { name: 'first pill' },
    pill2: { name: 'second pill' },
    pill3: { name: 'third pill' },
    pill1isActive: { name: 'first pill isActive' },
    pill2isActive: { name: 'second pill isActive' },
    pill3isActive: { name: 'third pill isActive' },
    onClick: { action: 'clicked' },
  },
};

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.bg.primary};
  padding: 30px;
  display: flex;
  gap: 12px;
`;

// eslint-disable-next-line react/prop-types
function PillContainer({ prefix, onClick, ...args }) {
  let message;
  let active;

  return (
    <Container>
      {[1, 2, 3].map((i) => {
        switch (i) {
          case 1:
            message = args.pill1;
            active = args.pill1isActive;
            break;
          case 2:
            message = args.pill2;
            active = args.pill2isActive;

            break;
          case 3:
            message = args.pill3;
            active = args.pill3isActive;

            break;

          default:
            break;
        }
        return (
          <Pill
            key={i}
            isActive={active}
            onClick={(e) => onClick(`Theme: ${prefix}; pill: ${i}`, e)}
          >
            {message}
          </Pill>
        );
      })}
    </Container>
  );
}

PillContainer.propTypes = {
  prefix: PropTypes.string.isRequired,
};

// Override light theme because this component is only set up for dark theme right now given fg and bg coloring
export const _default = (args) => (
  <>
    <PillContainer prefix="Light" {...args} />
    <ThemeProvider theme={theme}>
      <PillContainer prefix="Dark" {...args} />
    </ThemeProvider>
  </>
);

const PILL_OPTIONS = [
  { id: 1, label: 'George' },
  { id: 2, label: 'Ringo' },
  { id: 3, label: 'Paul' },
  { id: 4, label: 'John' },
];

function PillGroupContainer(args) {
  const [active, setActive] = useState(1);
  return (
    <Container>
      <PillGroup
        options={PILL_OPTIONS}
        value={active}
        onSelect={setActive}
        {...args}
      />
    </Container>
  );
}

// Override light theme because this component is only set up for dark theme right now given fg and bg coloring
export const PillGroups = (args) => (
  <>
    <PillGroupContainer {...args} />
    <ThemeProvider theme={theme}>
      <PillGroupContainer {...args} />
    </ThemeProvider>
  </>
);
PillGroups.parameters = {
  controls: { include: [], hideNoControlsWarning: true },
};
