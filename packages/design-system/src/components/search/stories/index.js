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
import { useCallback, useMemo, useState } from '@googleforcreators/react';
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
  args: {
    ariaClearLabel: 'clear search',
    ariaInputLabel: 'search for an image',
    disabled: false,
    emptyText: 'No options available',
    hasError: false,
    hint: 'default hint text',
    label: 'Find an image',
    isRTL: false,
    placeholder: 'search',
    placement: PLACEMENT.BOTTOM,
    popupZIndex: 1,
  },
  argTypes: {
    placement: {
      options: Object.values(PLACEMENT),
      control: 'select',
    },
    onChange: { action: 'handleSearchValueChange' },
  },
};

const Container = styled.div`
  width: 400px;
  height: 100vh;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
`;

// eslint-disable-next-line react/prop-types
export const _default = ({ onChange, ...args }) => {
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

  const handleSearchValueChange = useCallback(
    (value) => {
      onChange(value);
      setInputValue(value);
    },
    [onChange]
  );

  const handleOnClear = useCallback(() => {
    setInputValue('');
    setSelectedValue(null);
  }, []);

  return (
    <DarkThemeProvider>
      <Container>
        <Search
          handleSearchValueChange={handleSearchValueChange}
          onClear={handleOnClear}
          options={options}
          selectedValue={selectedValue}
          {...args}
        />
      </Container>
    </DarkThemeProvider>
  );
};

// eslint-disable-next-line react/prop-types
export const LightTheme = ({ onChange, ...args }) => {
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

  const handleSearchValueChange = useCallback(
    (value) => {
      onChange(value);
      setInputValue(value);
    },
    [onChange]
  );

  const handleOnClear = useCallback(() => {
    setInputValue('');
    setSelectedValue(null);
  }, []);

  return (
    <Container>
      <Search
        handleSearchValueChange={handleSearchValueChange}
        onClear={handleOnClear}
        options={options}
        selectedValue={selectedValue}
        {...args}
      />
    </Container>
  );
};
