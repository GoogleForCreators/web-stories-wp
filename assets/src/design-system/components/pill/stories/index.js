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
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import styled, { ThemeProvider } from 'styled-components';
/**
 * Internal dependencies
 */
import { theme } from '../../../theme';
import { Pill } from '..';

export default {
  title: 'DesignSystem/Components/Pill',
};

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.bg.primary};
  width: 600px;
  height: 400px;
  padding: 30px;
`;
// Override light theme because this component is only set up for dark theme right now given fg and bg coloring
export const _default = () => (
  <ThemeProvider theme={theme}>
    <Container>
      <Pill
        isActive={boolean('isActive', false)}
        onClick={(e) => action('click on pill')(e)}
      >
        {text('children', 'I am pill text')}
      </Pill>
    </Container>
  </ThemeProvider>
);

export const LightTheme = () => {
  return (
    <Container>
      <Pill
        isActive={boolean('isActive', false)}
        onClick={(e) => action('click on pill')(e)}
      >
        {text('children', 'I am pill text')}
      </Pill>
    </Container>
  );
};
