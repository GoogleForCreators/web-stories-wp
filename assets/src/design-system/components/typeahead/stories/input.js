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
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { DarkThemeProvider } from '../../../storybookUtils';
import TypeaheadInput from '../input';

export default {
  title: 'DesignSystem/Components/Typeahead/Input',
};

const Container = styled.div`
  width: 400px;
  height: 100vh;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
`;

export const _default = () => (
  <DarkThemeProvider>
    <Container>
      <TypeaheadInput
        aria-label={text('ariaInputLabel', 'my aria label')}
        ariaClearLabel={text('ariaClearLabel', 'label for clear button')}
        clearId={'my-typeahead-id'}
        disabled={boolean('disabled')}
        hasError={boolean('hasError')}
        id={'my-input-id'}
        inputValue={text('inputValue', '')}
        isFlexibleValue={boolean('isFlexibleValue')}
        isOpen={boolean('isOpen')}
        listId={'my-list-id'}
        name={'my-input-id'}
        onChange={action('change event triggered')}
        onClick={action('click event triggered')}
        onFocus={action('on focus event triggered')}
        onKeyDown={action('on keyDown event triggered')}
        handleClearInputValue={action('handle clear input value triggered')}
        placeholder={text('placeholder')}
      />
    </Container>
  </DarkThemeProvider>
);

export const LightTheme = () => (
  <Container>
    <TypeaheadInput
      aria-label={text('ariaInputLabel', 'my aria label')}
      ariaClearLabel={text('ariaClearLabel', 'label for clear button')}
      clearId={'my-typeahead-id'}
      disabled={boolean('disabled')}
      hasError={boolean('hasError')}
      id={'my-input-id'}
      inputValue={text('inputValue', '')}
      isFlexibleValue={boolean('isFlexibleValue')}
      isOpen={boolean('isOpen')}
      listId={'my-list-id'}
      name={'my-input-id'}
      onChange={action('change event triggered')}
      onClick={action('click event triggered')}
      onFocus={action('on focus event triggered')}
      onKeyDown={action('on keyDown event triggered')}
      handleClearInputValue={action('handle clear input value triggered')}
      placeholder={text('placeholder')}
    />
  </Container>
);
