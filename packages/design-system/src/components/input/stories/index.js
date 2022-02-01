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
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';

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
  args: {
    label1: 'Normal',
    label2: 'Suffix',
    label3: 'Error',
    label4: 'Disabled',

    hint: 'Hint',
    placeholder: 'placeholder',
    suffix: 'Suffix',
  },
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

// eslint-disable-next-line react/prop-types
export const _default = ({ label1, label2, label3, label4, ...args }) => {
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
            unit="ms"
            label={label1}
            {...args}
          />
          <Input
            aria-label="input-two"
            id="two-light"
            name="twoLight"
            value={inputState.twoLight}
            onChange={handleChange}
            label={label2}
            {...args}
          />
          <Input
            aria-label="input-three"
            id="three-light"
            name="threeLight"
            value={inputState.threeLight}
            onChange={handleChange}
            label={label3}
            {...args}
            hasError
          />
          <Input
            aria-label="disabled-input-one"
            id="four-light"
            name="fourLight"
            value={inputState.fourLight}
            onChange={handleChange}
            label={label4}
            {...args}
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
              label={label1}
              {...args}
            />
            <Input
              aria-label="input-five"
              id="two-dark"
              name="twoDark"
              value={inputState.twoDark}
              onChange={handleChange}
              label={label2}
              {...args}
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
              label={label3}
              {...args}
              hasError
            />
            <Input
              aria-label="disabled-input-two"
              id="four-dark"
              name="fourDark"
              value={inputState.fourDark}
              onChange={handleChange}
              label={label4}
              {...args}
              disabled
            />
          </Row>
        </Container>
      </DarkThemeProvider>
    </>
  );
};

// eslint-disable-next-line react/prop-types
export const Numeric = ({ label1, label2, label3, label4, ...args }) => {
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
            label={label1}
            {...args}
          />
          <NumericInput
            aria-label="input-two"
            id="two-light"
            name="twoLight"
            value={inputState.twoLight}
            onChange={handleChange}
            label={label2}
            {...args}
            unit="ms"
            suffix="Duration"
          />
          <NumericInput
            aria-label="disabled-input-one"
            id="three-light"
            name="threeLight"
            value={inputState.threeLight}
            onChange={handleChange}
            label={label4}
            {...args}
            disabled
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
              label={label1}
              {...args}
            />
            <NumericInput
              aria-label="input-four"
              id="two-dark"
              name="twoDark"
              value={inputState.twoDark}
              onChange={handleChange}
              label={label2}
              {...args}
              unit="°"
              suffix="Temp"
            />
            <NumericInput
              aria-label="disabled-input-two"
              id="three-dark"
              name="threeDark"
              value={inputState.threeDark}
              onChange={handleChange}
              label={label4}
              {...args}
              disabled
            />
          </Row>
        </Container>
      </DarkThemeProvider>
    </>
  );
};
Numeric.args = {
  label2: 'Unit and Suffix',
  min: 0,
  max: 100,
  allowEmpty: false,
  isFloat: false,
};
