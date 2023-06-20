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
import Toggle from '../toggle';
import { Text } from '../..';
import { DarkThemeProvider } from '../../../storybookUtils';
import { Headline } from '../../..';

export default {
  title: 'DesignSystem/Components/Toggle',
  component: Toggle,
  args: {
    label: 'label',
  },
  argTypes: {
    onChange: { action: 'onChange' },
  },
  parameters: {
    controls: {
      exclude: ['className', 'checked', 'disabled'],
    },
  },
};

const Container = styled.div`
  display: grid;
  row-gap: 20px;
  padding: 20px 40px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border: 1px solid ${({ theme }) => theme.colors.standard.black};
  max-width: 400px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column: 1 / -1;
  label {
    display: flex;
    align-items: center;
  }
`;

export const _default = {
  render: function Render(args) {
    const [inputState, setInputState] = useState({
      oneLight: false,
      twoLight: true,
      threeLight: false,
      fourLight: true,
      oneDark: false,
      twoDark: true,
      threeDark: false,
      fourDark: true,
    });

    const handleChange = (event) => {
      const name = event.target.name;
      const value = event.target.checked;

      args.onChange(`${name} is: ${value}`);
      setInputState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };

    return (
      <>
        <Headline as="h1">{'Toggle'}</Headline>
        <br />
        <Container>
          <Row>
            <Text.Paragraph>{'Normal'}</Text.Paragraph>
            <Text.Paragraph>{'Normal'}</Text.Paragraph>
            <Text.Paragraph>{'Disabled'}</Text.Paragraph>
            <Text.Paragraph>{'Disabled'}</Text.Paragraph>
          </Row>
          <Row>
            <Toggle
              id="one-light"
              aria-label="toggle-one-light"
              name="oneLight"
              checked={inputState.oneLight}
              onChange={handleChange}
            />
            <Toggle
              id="two-light"
              aria-label="toggle-two-light"
              name="twoLight"
              checked={inputState.twoLight}
              onChange={handleChange}
            />
            <Toggle
              id="three-light"
              aria-label="toggle-three-light"
              name="threeLight"
              checked={inputState.threeLight}
              onChange={handleChange}
              disabled
            />
            <Toggle
              id="four-light"
              aria-label="toggle-four-light"
              name="fourLight"
              checked={inputState.fourLight}
              onChange={handleChange}
              disabled
            />
          </Row>
        </Container>
        <DarkThemeProvider>
          <Container darkMode>
            <Row>
              <Text.Paragraph>{'Normal'}</Text.Paragraph>
              <Text.Paragraph>{'Normal'}</Text.Paragraph>
              <Text.Paragraph>{'Disabled'}</Text.Paragraph>
              <Text.Paragraph>{'Disabled'}</Text.Paragraph>
            </Row>
            <Row>
              <Toggle
                id="one-dark"
                aria-label="toggle-one-dark"
                name="oneDark"
                checked={inputState.oneDark}
                onChange={handleChange}
              />
              <Toggle
                id="two-dark"
                aria-label="toggle-two-dark"
                name="twoDark"
                checked={inputState.twoDark}
                onChange={handleChange}
              />
              <Toggle
                id="three-dark"
                aria-label="toggle-three-dark"
                name="threeDark"
                checked={inputState.threeDark}
                onChange={handleChange}
                disabled
              />
              <Toggle
                id="four-dark"
                aria-label="toggle-four-dark"
                name="fourDark"
                checked={inputState.fourDark}
                onChange={handleChange}
                disabled
              />
            </Row>
          </Container>
        </DarkThemeProvider>
      </>
    );
  },
};
