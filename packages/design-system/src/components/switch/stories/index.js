/*
 * Copyright 2021 Google LLC
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
import styled from 'styled-components';
import { useState } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { Switch } from '..';
import { Headline, Text } from '../../typography';
import { DarkThemeProvider } from '../../../storybookUtils';

export default {
  title: 'DesignSystem/Components/Switch',
  component: Switch,
  args: {
    offLabel: 'OFF',
    onLabel: 'ON',
  },
  argTypes: {
    onHandleChange: { action: 'handleChange' },
  },
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
  column-gap: 80px;

  padding: 20px 50px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border: 1px solid ${({ theme }) => theme.colors.standard.black};

  > div {
    display: grid;
    row-gap: 20px;
  }
`;

// eslint-disable-next-line react/prop-types
export const _default = ({ onHandleChange, ...args }) => {
  const [switchState, setSwitchState] = useState({
    radioOne: true,
    radioTwo: false,
    radioOneDisabled: true,
    radioTwoDisabled: false,
  });

  const handleChange = (evt, value) => {
    const name = evt?.target?.name;

    onHandleChange(name);
    setSwitchState((currentState) => ({
      ...currentState,
      [name]: value,
    }));
  };

  return (
    <>
      <Headline as="h1">{'Switch'}</Headline>
      <Container>
        <div>
          <Text>{'Normal'}</Text>
          <Switch
            name="radioOne"
            groupLabel="radio one"
            onChange={handleChange}
            value={switchState.radioOne}
            {...args}
          />
        </div>
        <div>
          <Text>{'Disabled Switch'}</Text>
          <Switch
            name="radioOneDisabled"
            groupLabel="radio one disabled"
            onChange={handleChange}
            value={switchState.radioOneDisabled}
            disabled
            {...args}
          />
        </div>
      </Container>
      <DarkThemeProvider>
        <Container>
          <div>
            <Text>{'Normal'}</Text>
            <Switch
              name="radioTwo"
              groupLabel="radio two"
              onChange={handleChange}
              value={switchState.radioTwo}
              {...args}
            />
          </div>
          <div>
            <Text>{'Disabled Switch'}</Text>
            <Switch
              name="radioTwoDisabled"
              groupLabel="radio two disabled"
              onChange={handleChange}
              value={switchState.radioTwoDisabled}
              disabled
              {...args}
            />
          </div>
        </Container>
      </DarkThemeProvider>
    </>
  );
};
