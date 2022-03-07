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
import { TextArea } from '..';
import { DarkThemeProvider } from '../../../storybookUtils';
import { Headline, Text } from '../../..';

export default {
  title: 'DesignSystem/Components/TextArea',
  component: TextArea,
  args: {
    label: 'label',
    hint: 'Hint',
    placeholder: 'placeholder',
  },
  argTypes: {
    onHandleChange: { action: 'onChange' },
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
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-column: 1 / -1;
  grid-column-gap: 60px;

  label {
    display: flex;
    align-items: center;
  }
`;

// eslint-disable-next-line react/prop-types
export const _default = ({ onHandleChange, ...args }) => {
  const [inputState, setInputState] = useState({
    oneLight: 'Light mode text',
    twoLight: 'disabled',
    threeLight: 'disabled',
    fourLight: 'limited',
    oneDark: 'Dark mode text',
    twoDark: '',
    threeDark: '',
    fourDark: '',
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    onHandleChange(`${name} changed to: ${value}`);
    setInputState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <Headline as="h1">{'Textarea'}</Headline>
      <br />
      <Container>
        <Row>
          <div>
            <Text isBold>{'Normal'}</Text>
            <TextArea
              aria-label="input-one"
              id="one-light"
              name="oneLight"
              value={inputState.oneLight}
              onChange={handleChange}
              {...args}
            />
          </div>
          <div>
            <Text isBold>{'Error'}</Text>
            <TextArea
              aria-label="input-two"
              id="two-light"
              name="twoLight"
              value={inputState.twoLight}
              onChange={handleChange}
              {...args}
              hasError
            />
          </div>
          <div>
            <Text isBold>{'Disabled'}</Text>
            <TextArea
              aria-label="disabled-input-one"
              id="three-light"
              name="threeLight"
              value={inputState.threeLight}
              onChange={handleChange}
              {...args}
              disabled
            />
          </div>
          <div>
            <Text isBold>{'With Counter'}</Text>
            <TextArea
              aria-label="input-four"
              id="four-light"
              name="fourLight"
              value={inputState.fourLight}
              onChange={handleChange}
              {...args}
              showCount
              maxLength={20}
            />
          </div>
        </Row>
      </Container>
      <DarkThemeProvider>
        <Container darkMode>
          <Row>
            <TextArea
              aria-label="input-four"
              id="one-dark"
              name="oneDark"
              value={inputState.oneDark}
              onChange={handleChange}
              {...args}
            />
            <TextArea
              aria-label="input-five"
              id="two-dark"
              name="twoDark"
              value={inputState.twoDark}
              onChange={handleChange}
              {...args}
              hasError
            />
            <TextArea
              aria-label="disabled-input-two"
              id="three-dark"
              name="threeDark"
              value={inputState.threeDark}
              onChange={handleChange}
              {...args}
              disabled
            />
            <TextArea
              aria-label="input-four"
              id="four-dark"
              name="fourDark"
              value={inputState.fourDark}
              onChange={handleChange}
              {...args}
              showCount
              maxLength={200}
            />
          </Row>
        </Container>
      </DarkThemeProvider>
    </>
  );
};
