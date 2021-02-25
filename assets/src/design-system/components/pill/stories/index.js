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
import { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
/**
 * Internal dependencies
 */
import { theme } from '../../../theme';
import { Pill } from '..';

export default {
  title: 'DesignSystem/Components/Pill',
};

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.bg.primary};
  padding: 30px;
  display: flex;
  gap: 12px;
`;

function Pills() {
  const [active, setActive] = useState(1);
  return (
    <Container>
      {[1, 2, 3].map((i) => (
        <Pill key={i} isActive={active === i} onClick={() => setActive(i)}>
          {`Pill ${i}`}
        </Pill>
      ))}
    </Container>
  );
}

// Override light theme because this component is only set up for dark theme right now given fg and bg coloring
export const _default = () => (
  <>
    <Pills />
    <ThemeProvider theme={theme}>
      <Pills />
    </ThemeProvider>
  </>
);
