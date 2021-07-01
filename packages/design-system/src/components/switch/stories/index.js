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
import { useState } from 'react';

/**
 * Internal dependencies
 */
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import { Switch } from '..';
import { Headline, Text } from '../../typography';
import { DarkThemeProvider } from '../../../storybookUtils';

export default {
  title: 'DesignSystem/Components/Switch',
  component: Switch,
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

export const _default = () => {
  const [switchState, setSwitchState] = useState({
    radioOne: true,
    radioTwo: false,
    radioOneDisabled: true,
    radioTwoDisabled: false,
  });

  const handleChange = (evt, value) => {
    const name = evt?.target?.name;

    action(name)(evt);
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
            offLabel={text('Off Label', 'OFF')}
            onLabel={text('On Label', 'ON')}
            onChange={handleChange}
            value={switchState.radioOne}
          />
        </div>
        <div>
          <Text>{'Disabled Switch'}</Text>
          <Switch
            name="radioOneDisabled"
            groupLabel="radio one disabled"
            offLabel={text('Off Label', 'OFF')}
            onLabel={text('On Label', 'ON')}
            onChange={handleChange}
            value={switchState.radioOneDisabled}
            disabled
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
              offLabel={text('Off Label', 'OFF')}
              onLabel={text('On Label', 'ON')}
              onChange={handleChange}
              value={switchState.radioTwo}
            />
          </div>
          <div>
            <Text>{'Disabled Switch'}</Text>
            <Switch
              name="radioTwoDisabled"
              groupLabel="radio two disabled"
              offLabel={text('Off Label', 'OFF')}
              onLabel={text('On Label', 'ON')}
              onChange={handleChange}
              value={switchState.radioTwoDisabled}
              disabled
            />
          </div>
        </Container>
      </DarkThemeProvider>
    </>
  );
};
