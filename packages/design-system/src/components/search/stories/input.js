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
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { DarkThemeProvider } from '../../../storybookUtils';
import { Text } from '../../typography';
import SearchInput from '../input';

export default {
  title: 'DesignSystem/Components/Search/Input',
  args: {
    ariaClearLabel: 'label for clear button',
    clearId: 'my-search-id',
    disabled: false,
    hasError: false,
    id: 'my-input-id',
    inputValue: '',
    isOpen: true,
    placeholder: 'search',
  },
  argTypes: {
    onChange: { action: 'change event triggered' },
    onClick: { action: 'click event triggered' },
    onFocus: { action: 'on focus event triggered' },
    handleClearInput: { action: 'handleClearInput triggered' },
    handleTabClear: { action: 'handleTabClear triggered' },
    onKeyDown: { action: 'on keyDown event triggered' },
  },
};

const Container = styled.div`
  width: 300px;
  padding: 12px 24px;
  margin: 24px 0;
  background-color: ${({ theme }) => theme.colors.bg.primary};
`;

export const _default = (args) => {
  const StorybookInput = (
    <SearchInput
      aria-label={'my aria label'}
      listId={'my-list-id'}
      name={'my-input-id'}
      {...args}
    />
  );

  return (
    <>
      <Container>
        <Text.Paragraph>{'Light Mode'}</Text.Paragraph>
        {StorybookInput}
      </Container>
      <DarkThemeProvider>
        <Container>
          <Text.Paragraph>{'Dark Mode'}</Text.Paragraph>
          {StorybookInput}
        </Container>
      </DarkThemeProvider>
    </>
  );
};
