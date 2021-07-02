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
import { number } from '@storybook/addon-knobs';
import { useState } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { DarkThemeProvider } from '../../../storybookUtils';
import { Text } from '../../..';
import { Slider } from '..';

const Container = styled.div`
  padding: 50px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border: 1px solid ${({ theme }) => theme.colors.standard.black};
`;

export default {
  title: 'DesignSystem/Components/Slider',
  component: Slider,
};

export const _default = () => {
  const [lightValue, setLightValue] = useState(0);
  const [darkValue, setDarkValue] = useState(0);
  const thumbSize = number('Thumb size', 24);
  const min = number('Min value', 0);
  const max = number('Max value', 100);
  const majorStep = number('Major step', 10);
  const minorStep = number('Minor step', 1);

  return (
    <>
      <Container>
        <Text>{'Percentage:'}</Text>
        <Slider
          thumbSize={thumbSize}
          min={min}
          max={max}
          majorStep={majorStep}
          minorStep={minorStep}
          handleChange={setLightValue}
          value={lightValue}
          suffix="%"
        />
      </Container>
      <DarkThemeProvider>
        <Container>
          <Text>{'Milliseconds:'}</Text>
          <Slider
            thumbSize={thumbSize}
            min={min}
            max={max}
            majorStep={majorStep}
            minorStep={minorStep}
            handleChange={setDarkValue}
            value={darkValue}
            suffix="ms"
          />
        </Container>
      </DarkThemeProvider>
    </>
  );
};
