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
import Radio from '../radio';
import { DarkThemeProvider } from '../../../storybookUtils';
import { Headline } from '../../typography';

export default {
  title: 'DesignSystem/Components/Radio',
  component: Radio,
  args: {
    label1: 'One',
    label2: 'Two',
    label3: 'Disabled',
    hint1: 'Hint 1',
    hint2: 'Hint 2',
    hint3: 'Hint 3',
  },
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(25%, 1fr));

  padding: 20px 50px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border: 1px solid ${({ theme }) => theme.colors.standard.black};
`;

export const _default = {
  render: function Render(args) {
    const [inputState, setInputState] = useState({
      radioOne: '1',
      radioTwo: '1',
      radioThree: '2',
      radioFour: '2',
      radioFive: '3',
      radioSix: '3',
    });

    const handleChange = (ev) => {
      const name = ev?.target?.name;
      const value = ev?.target?.value;
      setInputState((state) => ({ ...state, [name]: value }));
    };

    return (
      <>
        <Headline as="h1">{'Radio'}</Headline>
        <Container>
          <Radio
            name="radioOne"
            value="1"
            onChange={handleChange}
            checked={inputState.radioOne === '1'}
            label={args.label1}
          />
          <Radio
            name="radioOne"
            value="2"
            onChange={handleChange}
            checked={inputState.radioOne === '2'}
            label={args.label2}
          />
          <Radio
            name="radioOne"
            value="3"
            onChange={handleChange}
            checked={inputState.radioOne === '3'}
            label={args.label3}
            disabled
          />
        </Container>
        <DarkThemeProvider>
          <Container>
            <Radio
              name="radioTwo"
              onChange={handleChange}
              value="1"
              checked={inputState.radioTwo === '1'}
              label={args.label1}
            />
            <Radio
              name="radioTwo"
              onChange={handleChange}
              value="2"
              checked={inputState.radioTwo === '2'}
              label={args.label2}
            />
            <Radio
              name="radioTwo"
              value="3"
              onChange={handleChange}
              checked={inputState.radioTwo === '3'}
              label={args.label3}
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
            value="1"
            onChange={handleChange}
            checked={inputState.radioThree === '1'}
            label={args.label1}
            hint={args.hint1}
          />
          <Radio
            name="radioThree"
            value="2"
            onChange={handleChange}
            checked={inputState.radioThree === '2'}
            label={args.label2}
            hint={args.hint2}
          />
          <Radio
            name="radioThree"
            value="3"
            onChange={handleChange}
            checked={inputState.radioThree === '3'}
            label={args.label3}
            hint={args.hint3}
            disabled
          />
        </Container>
        <DarkThemeProvider>
          <Container>
            <Radio
              name="radioFour"
              onChange={handleChange}
              value="1"
              checked={inputState.radioFour === '1'}
              label={args.label1}
              hint={args.hint1}
            />
            <Radio
              name="radioFour"
              onChange={handleChange}
              value="2"
              checked={inputState.radioFour === '2'}
              label={args.label2}
              hint={args.hint2}
            />
            <Radio
              name="radioFour"
              value="3"
              onChange={handleChange}
              checked={inputState.radioFour === '3'}
              label={args.label3}
              hint={args.hint3}
              disabled
            />
          </Container>
        </DarkThemeProvider>
        <br />
        <br />
        <Headline as="h1">
          {'Disabled Radio Button Initially Selected'}
        </Headline>
        <Container>
          <Radio
            name="radioFive"
            value="1"
            onChange={handleChange}
            checked={inputState.radioFive === '1'}
            label={args.label1}
            hint={args.hint1}
          />
          <Radio
            name="radioFive"
            value="2"
            onChange={handleChange}
            checked={inputState.radioFive === '2'}
            label={args.label2}
            hint={args.hint2}
          />
          <Radio
            name="radioFive"
            value="3"
            onChange={handleChange}
            checked={inputState.radioFive === '3'}
            label={args.label3}
            hint={args.hint3}
            disabled
          />
        </Container>
        <DarkThemeProvider>
          <Container>
            <Radio
              name="radioSix"
              onChange={handleChange}
              value="1"
              checked={inputState.radioSix === '1'}
              label={args.label1}
              hint={args.hint1}
            />
            <Radio
              name="radioSix"
              onChange={handleChange}
              value="2"
              checked={inputState.radioSix === '2'}
              label={args.label2}
              hint={args.hint2}
            />
            <Radio
              name="radioSix"
              value="3"
              onChange={handleChange}
              checked={inputState.radioSix === '3'}
              label={args.label3}
              hint={args.hint3}
              disabled
            />
          </Container>
        </DarkThemeProvider>
      </>
    );
  },
};
