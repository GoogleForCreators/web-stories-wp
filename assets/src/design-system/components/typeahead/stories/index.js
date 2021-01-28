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
import { text } from '@storybook/addon-knobs';
import styled from 'styled-components';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

/**
 * Internal dependencies
 */
import Typeahead from '..';
import {
  basicDropDownOptions,
  nestedDropDownOptions,
} from '../../../storybookUtils/sampleData';

export default {
  title: 'DesignSystem/Components/Typeahead2',
};

const Container = styled.div`
  width: ${({ narrow }) => (narrow ? 150 : 400)}px;
  height: 100vh;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
`;

// something like this could live in our theme, be passed in our theme values
// and override all mui components we use while leaving us able to use our theme values outside of material ui for custom components.
const muiTheme = createMuiTheme({
  palette: {},
  overrides: {
    // Style sheet name
    MuiInput: {
      // Name of the rule
      focused: {
        // Some CSS
        color: 'secondary',
      },
    },
  },
});

export const _default = () => {
  return (
    <Container>
      <ThemeProvider theme={muiTheme}>
        <Typeahead
          options={basicDropDownOptions}
          label={text('label', 'Search')}
        />
      </ThemeProvider>
    </Container>
  );
};

export const GroupedSearch = () => {
  return (
    <Container>
      <Typeahead
        options={nestedDropDownOptions}
        label={text('label', 'Search')}
        groupBy={(option) => option.group}
      />
    </Container>
  );
};
