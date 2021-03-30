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
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import { HexInput } from '..';
import { DarkThemeProvider } from '../../../storybookUtils';
import { Headline } from '../../..';

export default {
  title: 'DesignSystem/Components/HexInput',
  component: HexInput,
};

const Container = styled.div`
  display: grid;
  row-gap: 20px;
  padding: 20px 50px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border: 1px solid ${({ theme }) => theme.colors.standard.black};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-column: 1 / -1;
  grid-column-gap: 60px;

  label {
    display: flex;
    align-items: center;
  }
`;

export const _default = () => {
  const [inputState, setInputState] = useState({
    oneLight: {
      color: {
        r: 255,
        g: 255,
        b: 255,
      },
    },
    oneDark: {
      color: {
        r: 0,
        g: 0,
        b: 0,
      },
    },
  });

  const handleChange = (event) => {
    if (!event?.target) {
      return;
    }
    const name = event.target.name;
    const value = event.target.value;

    action(event.target.name)(event);
    setInputState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <Headline as="h1">{'Hex Input'}</Headline>
      <br />
      <Container>
        <Row>
          <HexInput
            aria-label="input-one"
            id="one-light"
            name="oneLight"
            value={inputState.oneLight}
            onChange={handleChange}
            label={text('Input 1 Label', 'Normal')}
            hint={text('Hint', 'Hint')}
            placeholder="placeholder"
          />
        </Row>
      </Container>
      <DarkThemeProvider>
        <Container darkMode>
          <Row>
            <HexInput
              aria-label="input-four"
              id="one-dark"
              name="oneDark"
              value={inputState.oneDark}
              onChange={handleChange}
              label={text('Input 1 Label', 'Normal')}
              hint={text('Hint', 'Hint')}
              placeholder="placeholder"
            />
          </Row>
        </Container>
      </DarkThemeProvider>
    </>
  );
};
