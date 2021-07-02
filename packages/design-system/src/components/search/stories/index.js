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
import { useCallback, useMemo, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, number, select, text } from '@storybook/addon-knobs';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { DarkThemeProvider } from '../../../storybookUtils';
import { PLACEMENT } from '../../popup';
import { Search } from '../search';
import { basicDropDownOptions } from '../../../storybookUtils/sampleData';

export default {
  title: 'DesignSystem/Components/Search',
};

const Container = styled.div`
  width: 400px;
  height: 100vh;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
`;

export const _default = () => {
  const [selectedValue, setSelectedValue] = useState(basicDropDownOptions[2]);

  const [inputValue, setInputValue] = useState('');

  const options = useMemo(() => {
    if (!inputValue || inputValue.length === 0) {
      return basicDropDownOptions;
    }

    return basicDropDownOptions.filter(
      ({ label, value }) =>
        label
          .toString()
          .toLowerCase()
          .startsWith(inputValue.toLowerCase().trim()) ||
        value
          .toString()
          .toLowerCase()
          .startsWith(inputValue.toLowerCase().trim())
    );
  }, [inputValue]);

  const handleSearchValueChange = useCallback((value) => {
    action('handleSearchValueChange')(value);
    setInputValue(value);
  }, []);

  return (
    <DarkThemeProvider>
      <Container>
        <Search
          ariaClearLabel={text('ariaClearLabel', 'clear search')}
          ariaInputLabel={text('ariaInputLabel', 'search for an image')}
          disabled={boolean('disabled')}
          emptyText={text('emptyText', 'No options available')}
          handleSearchValueChange={handleSearchValueChange}
          hasError={boolean('hasError')}
          hint={text('hint', 'default hint text')}
          label={text('label', 'Find an image')}
          isRTL={boolean('isRTL')}
          onMenuItemClick={(event, newValue) => {
            action('onMenuItemClick', event);
            setSelectedValue(newValue);
          }}
          options={options}
          placeholder={text('placeholder', 'search')}
          placement={select('placement', Object.values(PLACEMENT))}
          popupZIndex={number('popupZIndex')}
          selectedValue={selectedValue}
        />
      </Container>
    </DarkThemeProvider>
  );
};

export const LightTheme = () => {
  const [selectedValue, setSelectedValue] = useState();

  const [inputValue, setInputValue] = useState('');

  const options = useMemo(() => {
    if (!inputValue || inputValue.length === 0) {
      return [];
    }

    return basicDropDownOptions.filter(
      ({ label, value }) =>
        label
          .toString()
          .toLowerCase()
          .startsWith(inputValue.toLowerCase().trim()) ||
        value
          .toString()
          .toLowerCase()
          .startsWith(inputValue.toLowerCase().trim())
    );
  }, [inputValue]);

  const handleSearchValueChange = useCallback((value) => {
    action('handleSearchValueChange')(value);
    setInputValue(value);
  }, []);

  return (
    <Container>
      <Search
        ariaClearLabel={text('ariaClearLabel', 'clear input')}
        ariaInputLabel={text('ariaInputLabel', 'search for stories')}
        disabled={boolean('disabled')}
        emptyText={text('emptyText', 'No options available')}
        handleSearchValueChange={handleSearchValueChange}
        hasError={boolean('hasError')}
        hint={text('hint', 'default hint text')}
        label={text('label', 'Search For Stories')}
        isRTL={boolean('isRTL')}
        onMenuItemClick={(event, newValue) => {
          action('onMenuItemClick', event);
          setSelectedValue(newValue);
        }}
        options={options}
        placeholder={text('placeholder', 'search')}
        placement={select('placement', Object.values(PLACEMENT))}
        popupZIndex={number('popupZIndex')}
        selectedValue={selectedValue}
      />
    </Container>
  );
};
