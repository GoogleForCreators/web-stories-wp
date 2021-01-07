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
import { boolean, number, select, text } from '@storybook/addon-knobs';
import styled from 'styled-components';
import { useCallback, useMemo, useState } from 'react';

/**
 * Internal dependencies
 */
import { DarkThemeProvider } from '../../../storybookUtils';
import { PLACEMENT } from '../../popup';
import { Text } from '../../typography';
import { Typeahead } from '../typeahead';
import {
  basicDropDownOptions,
  nestedDropDownOptions,
} from '../../../storybookUtils/sampleData';

export default {
  title: 'DesignSystem/Components/Typeahead',
};

const Container = styled.div`
  width: ${({ narrow }) => (narrow ? 150 : 400)}px;
  height: 100vh;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
`;

export const _default = () => {
  const [selectedValue, setSelectedValue] = useState(
    basicDropDownOptions[2].value
  );

  const [inputValue, setInputValue] = useState('');

  const options = useMemo(() => {
    const searchValue = inputValue.value || selectedValue;
    if (!searchValue || searchValue.length === 0) {
      return basicDropDownOptions;
    }

    return basicDropDownOptions.filter(
      ({ label, value }) =>
        label
          .toString()
          .toLowerCase()
          .startsWith(searchValue.toLowerCase().trim()) ||
        value
          .toString()
          .toLowerCase()
          .startsWith(searchValue.toLowerCase().trim())
    );
  }, [selectedValue, inputValue]);

  const handleTypeaheadValueChange = useCallback((value) => {
    action('handleTypeaheadValueChange')(value);
    setInputValue(value);
  }, []);

  return (
    <DarkThemeProvider>
      <Container>
        <Text>
          {
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus luctus ex eu maximus. Nam cursus nulla massa, vel porta nisi mattis et. Vivamus vitae massa nulla. Sed enim velit, iaculis ut pharetra vitae, sagittis et dui. In sollicitudin lectus vel rhoncus auctor. Morbi pulvinar nisl sed mi fringilla, vitae bibendum felis egestas.'
          }
        </Text>
        <Typeahead
          handleTypeaheadValueChange={handleTypeaheadValueChange}
          emptyText={'No options available'}
          options={options}
          hasError={boolean('hasError')}
          hint={text('hint', 'default hint text')}
          isFlexibleValue={boolean('isFlexibleValue')}
          placeholder={text('placeholder', 'select a value')}
          ariaLabel={text('ariaLabel')}
          dropDownLabel={text('dropDownLabel', 'label')}
          isKeepMenuOpenOnSelection={boolean('isKeepMenuOpenOnSelection')}
          isRTL={boolean('isRTL')}
          disabled={boolean('disabled')}
          selectedValue={selectedValue}
          onMenuItemClick={(event, newValue) => {
            action('onMenuItemClick', event);
            setSelectedValue(newValue);
          }}
          placement={select('placement', Object.values(PLACEMENT))}
          popupZIndex={number('popupZIndex')}
        />
      </Container>
    </DarkThemeProvider>
  );
};

export const LightTheme = () => {
  const [selectedValue, setSelectedValue] = useState(null);

  const [inputValue, setInputValue] = useState('');

  const options = useMemo(() => {
    const searchValue = inputValue.value || selectedValue;
    if (!searchValue || searchValue.length === 0) {
      return basicDropDownOptions;
    }

    return basicDropDownOptions.filter(
      ({ label, value }) =>
        label
          .toString()
          .toLowerCase()
          .startsWith(searchValue.toLowerCase().trim()) ||
        value
          .toString()
          .toLowerCase()
          .startsWith(searchValue.toLowerCase().trim())
    );
  }, [selectedValue, inputValue]);

  const handleTypeaheadValueChange = useCallback((value) => {
    action('handleTypeaheadValueChange')(value);
    setInputValue(value);
  }, []);

  return (
    <Container>
      <Typeahead
        emptyText={'No options available'}
        options={options}
        handleTypeaheadValueChange={handleTypeaheadValueChange}
        hasError={boolean('hasError')}
        hint={text('hint', 'default hint text')}
        placeholder={text('placeholder', 'select a value')}
        ariaLabel={text('ariaLabel')}
        dropDownLabel={text('dropDownLabel', 'label')}
        isKeepMenuOpenOnSelection={boolean('isKeepMenuOpenOnSelection')}
        isRTL={boolean('isRTL')}
        disabled={boolean('disabled')}
        selectedValue={selectedValue}
        onMenuItemClick={(event, newValue) => {
          action('onMenuItemClick', event);
          setSelectedValue(newValue);
        }}
        placement={select('placement', Object.values(PLACEMENT))}
        popupZIndex={number('popupZIndex')}
      />
    </Container>
  );
};

export const SubMenus = () => {
  const [selectedValue, setSelectedValue] = useState('dog-2');

  const [inputValue, setInputValue] = useState(selectedValue);

  const options = useMemo(() => {
    const searchValue = inputValue.value;
    if (!searchValue || searchValue.length === 0) {
      return nestedDropDownOptions;
    }

    return nestedDropDownOptions
      .map((optionSet) => {
        const matchingOptions = optionSet.options.filter(
          ({ label = '', value = '' }) =>
            label
              .toString()
              .toLowerCase()
              .startsWith(searchValue.toLowerCase().trim()) ||
            value
              .toString()
              .toLowerCase()
              .startsWith(searchValue.toLowerCase().trim())
        );
        if (matchingOptions.length > 0) {
          return {
            ...optionSet,
            options: [...matchingOptions],
          };
        } else {
          return null;
        }
      })
      .filter(Boolean);
  }, [inputValue]);

  const handleTypeaheadValueChange = useCallback((value) => {
    action('handleTypeaheadValueChange')(value);
    setInputValue(value);
  }, []);

  return (
    <Container>
      <Typeahead
        emptyText={'No options available'}
        options={options}
        handleTypeaheadValueChange={handleTypeaheadValueChange}
        hasError={boolean('hasError')}
        hint={text('hint', 'default hint text')}
        placeholder={text('placeholder', 'select a value')}
        ariaLabel={text('ariaLabel')}
        dropDownLabel={text('dropDownLabel', 'label')}
        isKeepMenuOpenOnSelection={boolean('isKeepMenuOpenOnSelection')}
        isRTL={boolean('isRTL')}
        disabled={boolean('disabled')}
        selectedValue={selectedValue}
        onMenuItemClick={(event, newValue) => {
          action('onMenuItemClick', event);
          setSelectedValue(newValue);
        }}
        placement={select('placement', Object.values(PLACEMENT))}
        popupZIndex={number('popupZIndex')}
      />
    </Container>
  );
};
