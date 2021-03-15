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
import { boolean, number, text } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import { Input } from '..';
import { NumericInput } from '../numericInput';
import { DarkThemeProvider } from '../../../storybookUtils';
import { Headline } from '../../..';
import { AlignCenter } from '../../../icons';

export default {
  title: 'DesignSystem/Components/Input',
  component: Input,
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

const IconContainer = styled.div`
  height: 32px;
  width: 32px;
  margin-right: -8px;
`;

export const _default = () => {
  const [inputState, setInputState] = useState({
    oneLight: '600',
    twoLight: 'we have an error',
    threeLight: 'disabled',
    fourLight: 'disabled',
    oneDark: 'Dark mode text',
    twoDark: '',
    threeDark: '',
    fourDark: '',
  });

  const handleChange = (event) => {
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
      <Headline as="h1">{'Input'}</Headline>
      <br />
      <Container>
        <Row>
          <Input
            aria-label="input-one"
            id="one-light"
            name="oneLight"
            value={inputState.oneLight}
            onChange={handleChange}
            label={text('Input 1 Label', 'Normal')}
            hint={text('Hint', 'Hint')}
            placeholder="placeholder"
            suffix={text('Suffix')}
            unit="ms"
          />
          <Input
            aria-label="input-two"
            id="two-light"
            name="twoLight"
            value={inputState.twoLight}
            onChange={handleChange}
            label={text('Input 2 Label', 'Suffix')}
            hint={text('Hint', 'Hint')}
            placeholder="placeholder"
            suffix={text('Suffix', 'Duration')}
          />
          <Input
            aria-label="input-three"
            id="three-light"
            name="threeLight"
            value={inputState.threeLight}
            onChange={handleChange}
            label={text('Input 3 Label', 'Error')}
            hint={text('Hint', 'Hint')}
            placeholder="placeholder"
            suffix={text('Suffix')}
            hasError
          />
          <Input
            aria-label="disabled-input-one"
            id="four-light"
            name="fourLight"
            value={inputState.fourLight}
            onChange={handleChange}
            label={text('Input 4 Label', 'Disabled')}
            hint={text('Hint', 'Hint')}
            placeholder="placeholder"
            suffix={text('Suffix')}
            disabled
          />
        </Row>
      </Container>
      <DarkThemeProvider>
        <Container>
          <Row>
            <Input
              aria-label="input-four"
              id="one-dark"
              name="oneDark"
              value={inputState.oneDark}
              onChange={handleChange}
              label={text('Input 1 Label', 'Normal')}
              hint={text('Hint', 'Hint')}
              placeholder="placeholder"
              suffix={text('Suffix')}
            />
            <Input
              aria-label="input-five"
              id="two-dark"
              name="twoDark"
              value={inputState.twoDark}
              onChange={handleChange}
              label={text('Input 2 Label', 'Suffix')}
              hint={text('Hint', 'Hint')}
              placeholder="placeholder"
              suffix={
                <IconContainer>
                  <AlignCenter />
                </IconContainer>
              }
            />
            <Input
              aria-label="input-six"
              id="three-dark"
              name="threeDark"
              value={inputState.threeDark}
              onChange={handleChange}
              label={text('Input 3 Label', 'Error')}
              hint={text('Hint', 'Hint')}
              placeholder="placeholder"
              suffix={text('Suffix')}
              hasError
            />
            <Input
              aria-label="disabled-input-two"
              id="four-dark"
              name="fourDark"
              value={inputState.fourDark}
              onChange={handleChange}
              label={text('Input 4 Label', 'Disabled')}
              hint={text('Hint', 'Hint')}
              placeholder="placeholder"
              suffix={text('Suffix')}
              disabled
            />
          </Row>
        </Container>
      </DarkThemeProvider>
    </>
  );
};

export const Numeric = () => {
  const [inputState, setInputState] = useState({
    oneLight: 600,
    twoLight: 0,
    threeLight: 1234,
    oneDark: 0,
    twoDark: 7890,
    threeDark: 0,
  });

  const handleChange = (ev, value) => {
    const name = ev.target.name;

    setInputState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <Headline as="h1">{'Numeric Input'}</Headline>
      <br />
      <Container>
        <Row>
          <NumericInput
            aria-label="input-one"
            id="one-light"
            name="oneLight"
            value={inputState.oneLight}
            onChange={handleChange}
            label={text('Input 1 Label', 'Normal')}
            hint={text('Hint', 'Hint')}
            placeholder="placeholder"
            suffix={text('Suffix')}
            min={number('min')}
            max={number('max')}
            allowEmpty={boolean('Allow Empty', false)}
            isFloat={boolean('isFloat', false)}
          />
          <NumericInput
            aria-label="input-two"
            id="two-light"
            name="twoLight"
            value={inputState.twoLight}
            onChange={handleChange}
            label={text('Input 2 Label', 'Unit and Suffix')}
            hint={text('Hint', 'Hint')}
            placeholder="placeholder"
            suffix="Duration"
            min={number('min')}
            max={number('max')}
            unit="ms"
            allowEmpty={boolean('Allow Empty', false)}
            isFloat={boolean('isFloat', false)}
          />
          <NumericInput
            aria-label="disabled-input-one"
            id="three-light"
            name="threeLight"
            value={inputState.threeLight}
            onChange={handleChange}
            label={text('Input 4 Label', 'Disabled')}
            hint={text('Hint', 'Hint')}
            placeholder="placeholder"
            suffix={text('Suffix')}
            min={number('min')}
            max={number('max')}
            disabled
            allowEmpty={boolean('Allow Empty', false)}
            isFloat={boolean('isFloat', false)}
          />
        </Row>
      </Container>
      <DarkThemeProvider>
        <Container>
          <Row>
            <NumericInput
              aria-label="input-three"
              id="one-dark"
              name="oneDark"
              value={inputState.oneDark}
              onChange={handleChange}
              label={text('Input 1 Label', 'Normal')}
              hint={text('Hint', 'Hint')}
              placeholder="placeholder"
              min={number('min')}
              max={number('max')}
              suffix={text('Suffix')}
              allowEmpty={boolean('Allow Empty', false)}
              isFloat={boolean('isFloat', false)}
            />
            <NumericInput
              aria-label="input-four"
              id="two-dark"
              name="twoDark"
              value={inputState.twoDark}
              onChange={handleChange}
              label={text('Input 2 Label', 'Suffix')}
              hint={text('Hint', 'Hint')}
              placeholder="placeholder"
              suffix="Temp"
              min={number('min')}
              max={number('max')}
              unit="°"
              allowEmpty={boolean('Allow Empty', false)}
              isFloat={boolean('isFloat', false)}
            />
            <NumericInput
              aria-label="disabled-input-two"
              id="three-dark"
              name="threeDark"
              value={inputState.threeDark}
              onChange={handleChange}
              label={text('Input 4 Label', 'Disabled')}
              hint={text('Hint', 'Hint')}
              placeholder="placeholder"
              suffix={text('Suffix')}
              min={number('min')}
              max={number('max')}
              disabled
              allowEmpty={boolean('Allow Empty', false)}
              isFloat={boolean('isFloat', false)}
            />
          </Row>
        </Container>
      </DarkThemeProvider>
    </>
  );
};
