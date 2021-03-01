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
import MediaInput from '..';
import { getOptions } from '../../menu/utils';
import {basicDropDownOptions, shortDropDownOptions} from '../../../storybookUtils/sampleData';
import image from './image.jpg';

export default {
  title: 'DesignSystem/Components/MediaInput',
};

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.bg.secondary};
  width: 600px;
  height: 400px;
  padding: 30px;
`;
const _basicDropDownOptions = getOptions(basicDropDownOptions);
const _shortDropDownOptions = getOptions(shortDropDownOptions);

// Override light theme because this component is only set up for dark theme right now
export const _default = () => (
  <ThemeProvider theme={theme}>
    <Container>
      <MediaInput
        value={image}
        onChange={() => {}}
        menuOptions={_shortDropDownOptions}
        onMenuOption={() => {}}
      />
    </Container>
  </ThemeProvider>
);
