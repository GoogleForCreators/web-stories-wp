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

/**
 * Internal dependencies
 */
import Input from '../input';
import NumericInput from '../numericInput';
import { DarkThemeProvider } from '../../../storybookUtils';
import { Headline, Text } from '../../..';
import { AlignCenter } from '../../../icons';

export default {
  title: 'DesignSystem/Components/Input',
  component: Input,
  args: {
    label: 'Label',
    hint: 'Hint',
    placeholder: 'placeholder',
    suffix: '',
    unit: '',
  },
  argTypes: {
    handleOnChange: { action: 'handle on change' },
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
export const _default = ({ handleOnChange, ...args }) => {
  const [inputState, setInputState] = useState({
    oneLight: '600',
    twoLight: 'w/ suffix',
    threeLight: 'we have an error',
    fourLight: 'disabled',
    oneDark: 'Dark mode text',
    twoDark: '',
    threeDark: '',
    fourDark: '',
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    handleOnChange(name, value);
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
          <Text.Paragraph isBold>
            {'Normal'}
            <Input
              aria-label="input-one"
              id="one-light"
              name="oneLight"
              value={inputState.oneLight}
              onChange={handleChange}
              unit="ms"
              {...args}
            />
          </Text.Paragraph>
          <Text.Paragraph isBold>
            {'Suffix Icon'}
            <Input
              aria-label="input-two"
              id="two-light"
              name="twoLight"
              value={inputState.twoLight}
              onChange={handleChange}
              {...args}
              suffix={
                <IconContainer>
                  <AlignCenter />
                </IconContainer>
              }
            />
          </Text.Paragraph>
          <Text.Paragraph isBold>
            {'Error'}
            <Input
              aria-label="input-three"
              id="three-light"
              name="threeLight"
              value={inputState.threeLight}
              onChange={handleChange}
              {...args}
              hasError
            />
          </Text.Paragraph>
          <Text.Paragraph isBold>
            {'Disabled'}
            <Input
              aria-label="disabled-input-one"
              id="four-light"
              name="fourLight"
              value={inputState.fourLight}
              onChange={handleChange}
              {...args}
              disabled
            />
          </Text.Paragraph>
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
              {...args}
            />
            <Input
              aria-label="input-five"
              id="two-dark"
              name="twoDark"
              value={inputState.twoDark}
              onChange={handleChange}
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
              {...args}
              hasError
            />
            <Input
              aria-label="disabled-input-two"
              id="four-dark"
              name="fourDark"
              value={inputState.fourDark}
              onChange={handleChange}
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
export const Numeric = ({ handleOnChange, ...args }) => {
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
    handleOnChange(name, value);

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
          <Text.Paragraph isBold>
            {'Normal'}
            <NumericInput
              aria-label="input-one"
              id="one-light"
              name="oneLight"
              value={inputState.oneLight}
              onChange={handleChange}
              {...args}
            />
          </Text.Paragraph>
          <Text.Paragraph isBold>
            {'Unit and Suffix'}
            <NumericInput
              aria-label="input-two"
              id="two-light"
              name="twoLight"
              value={inputState.twoLight}
              onChange={handleChange}
              {...args}
              unit="ms"
              suffix="Duration"
            />
          </Text.Paragraph>
          <Text.Paragraph isBold>
            {'Disabled'}
            <NumericInput
              aria-label="disabled-input-one"
              id="three-light"
              name="threeLight"
              value={inputState.threeLight}
              onChange={handleChange}
              {...args}
              disabled
            />
          </Text.Paragraph>
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
              {...args}
            />
            <NumericInput
              aria-label="input-four"
              id="two-dark"
              name="twoDark"
              value={inputState.twoDark}
              onChange={handleChange}
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
  min: 0,
  max: 100,
  allowEmpty: false,
  isFloat: false,
};
