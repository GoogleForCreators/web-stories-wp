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
import { Radio } from '../radio';
import { DarkThemeProvider } from '../../../storybookUtils';
import { Headline } from '../../typography';

export default {
  title: 'DesignSystem/Components/Radio',
  component: Radio,
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(25%, 1fr));

  padding: 20px 50px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border: 1px solid ${({ theme }) => theme.colors.standard.black};
`;

export const _default = () => {
  const [inputState, setInputState] = useState({
    radioOne: 3,
    radioTwo: 3,
    radioThree: 3,
    radioFour: 3,
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
          label={text('Radio Button Three Label', 'Three (Disabled)')}
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
            label={text('Radio Button Three Label', 'Three (Disabled)')}
            disabled
          />
        </Container>
      </DarkThemeProvider>
      <br />
      <br />
      <Headline as="h1">{'Radio with Hint'}</Headline>
      <Container>
        <Radio
          name="radioThree"
          value={1}
          onChange={handleChange}
          checked={inputState.radioThree === 1}
          label={text('Radio Button One Label', 'One')}
          hint={text('Radio Button One Hint', 'Hint One')}
        />
        <Radio
          name="radioThree"
          value={2}
          onChange={handleChange}
          checked={inputState.radioThree === 2}
          label={text('Radio Button Two Label', 'Two')}
          hint={text('Radio Button Two Hint', 'Hint Two')}
        />
        <Radio
          name="radioThree"
          value={3}
          onChange={handleChange}
          checked={inputState.radioThree === 3}
          label={text('Radio Button Three Label', 'Three (Disabled)')}
          hint={text('Radio Button Three Hint', 'Hint Three')}
          disabled
        />
      </Container>
      <DarkThemeProvider>
        <Container>
          <Radio
            name="radioFour"
            onChange={handleChange}
            value={1}
            checked={inputState.radioFour === 1}
            label={text('Radio Button One Label', 'One')}
            hint={text('Radio Button One Hint', 'Hint One')}
          />
          <Radio
            name="radioFour"
            onChange={handleChange}
            value={2}
            checked={inputState.radioFour === 2}
            label={text('Radio Button Two Label', 'Two')}
            hint={text('Radio Button Two Hint', 'Hint Two')}
          />
          <Radio
            name="radioFour"
            value={3}
            onChange={handleChange}
            checked={inputState.radioFour === 3}
            label={text('Radio Button Three Label', 'Three (Disabled)')}
            hint={text('Radio Button Three Hint', 'Hint Three')}
            disabled
          />
        </Container>
      </DarkThemeProvider>
    </>
  );
};
