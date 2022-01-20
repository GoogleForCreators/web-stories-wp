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
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import styled, { ThemeProvider } from 'styled-components';
/**
 * Internal dependencies
 */
import { theme } from '../../../theme';
import { Pill, PillGroup } from '..';

export default {
  title: 'DesignSystem/Components/Pill',
};

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.bg.primary};
  padding: 30px;
  display: flex;
  gap: 12px;
`;

function PillContainer({ prefix }) {
  return (
    <Container>
      {[1, 2, 3].map((i) => (
        <Pill
          key={i}
          isActive={boolean(`${prefix}: isActive ${i}`, false)}
          onClick={(e) => action(`${prefix}: click on pill ${i}`)(e)}
        >
          {text(`${prefix}: pill text ${i}`, `${prefix} pill ${i}`)}
        </Pill>
      ))}
    </Container>
  );
}

PillContainer.propTypes = {
  prefix: PropTypes.string.isRequired,
};

// Override light theme because this component is only set up for dark theme right now given fg and bg coloring
export const _default = () => (
  <>
    <PillContainer prefix="Light" />
    <ThemeProvider theme={theme}>
      <PillContainer prefix="Dark" />
    </ThemeProvider>
  </>
);

const PILL_OPTIONS = [
  { id: 1, label: 'George' },
  { id: 2, label: 'Ringo' },
  { id: 3, label: 'Paul' },
  { id: 4, label: 'John' },
];

function PillGroupContainer() {
  const [active, setActive] = useState(1);
  return (
    <Container>
      <PillGroup options={PILL_OPTIONS} value={active} onSelect={setActive} />
    </Container>
  );
}

// Override light theme because this component is only set up for dark theme right now given fg and bg coloring
export const PillGroups = () => (
  <>
    <PillGroupContainer />
    <ThemeProvider theme={theme}>
      <PillGroupContainer />
    </ThemeProvider>
  </>
);
