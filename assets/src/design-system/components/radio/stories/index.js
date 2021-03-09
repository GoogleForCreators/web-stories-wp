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
import { text } from '@storybook/addon-knobs';
import { Radio } from '..';
import { DarkThemeProvider } from '../../../storybookUtils';
import { Headline } from '../../typography';

export default {
  title: 'DesignSystem/Components/Radio',
  component: Radio,
};

const Container = styled.div`
  display: grid;
  row-gap: 20px;
  padding: 20px 50px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border: 1px solid ${({ theme }) => theme.colors.standard.black};
`;

export const _default = () => {
  const [inputState, setInputState] = useState({
    radioOne: 1,
    radioTwo: 1,
  });

  const handleChange = (ev) => {
    const name = ev?.target?.name;
    const value = parseInt(ev?.target?.value);
    setInputState((state) => ({ ...state, [name]: value }));
  };

  return (
    <>
      <Headline as="h1">{'Radio'}</Headline>
      <Container>
        <Radio
          name="radioOne"
          value={1}
          onChange={handleChange}
          checked={inputState.radioOne === 1}
          label={text('Radio Button One Label', 'One')}
        />
        <Radio
          name="radioOne"
          value={2}
          onChange={handleChange}
          checked={inputState.radioOne === 2}
          label={text('Radio Button Two Label', 'Two')}
        />
        <Radio
          name="radioOne"
          value={3}
          onChange={handleChange}
          checked={inputState.radioOne === 3}
          label={text('Radio Button Three Label', 'Three')}
          disabled
        />
      </Container>
      <DarkThemeProvider>
        <Container>
          <Radio
            name="radioTwo"
            onChange={handleChange}
            value={1}
            checked={inputState.radioTwo === 1}
            label={text('Radio Button One Label', 'One')}
          />
          <Radio
            name="radioTwo"
            onChange={handleChange}
            value={2}
            checked={inputState.radioTwo === 2}
            label={text('Radio Button Two Label', 'Two')}
          />
          <Radio
            name="radioTwo"
            value={3}
            onChange={handleChange}
            checked={inputState.radioTwo === 3}
            label={text('Radio Button Three Label', 'Three')}
            disabled
          />
        </Container>
      </DarkThemeProvider>
    </>
  );
};
