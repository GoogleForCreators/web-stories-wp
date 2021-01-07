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
  width: 400px;
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
          ariaClearLabel={text('ariaClearLabel', 'clear input')}
          ariaInputLabel={text('ariaInputLabel')}
          disabled={boolean('disabled')}
          emptyText={text('emptyText', 'No options available')}
          handleTypeaheadValueChange={handleTypeaheadValueChange}
          hasError={boolean('hasError')}
          hint={text('hint', 'default hint text')}
          isFlexibleValue={boolean('isFlexibleValue')}
          isKeepMenuOpenOnSelection={boolean('isKeepMenuOpenOnSelection')}
          isRTL={boolean('isRTL')}
          onMenuItemClick={(event, newValue) => {
            action('onMenuItemClick', event);
            setSelectedValue(newValue);
          }}
          options={options}
          placeholder={text('placeholder', 'select a value')}
          placement={select('placement', Object.values(PLACEMENT))}
          popupZIndex={number('popupZIndex')}
          selectedValue={selectedValue}
        />
      </Container>
    </DarkThemeProvider>
  );
};

export const LightTheme = () => {
  const [selectedValue, setSelectedValue] = useState(null);

  const [inputValue, setInputValue] = useState(null);

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

  const handleTypeaheadValueChange = useCallback((value) => {
    action('handleTypeaheadValueChange')(value);
    setInputValue(value);
  }, []);

  return (
    <Container>
      <Typeahead
        ariaClearLabel={text('ariaClearLabel', 'clear input')}
        ariaInputLabel={text('ariaInputLabel')}
        disabled={boolean('disabled')}
        emptyText={text('emptyText', 'No options available')}
        handleTypeaheadValueChange={handleTypeaheadValueChange}
        hasError={boolean('hasError')}
        hint={text('hint', 'default hint text')}
        isFlexibleValue={boolean('isFlexibleValue')}
        isKeepMenuOpenOnSelection={boolean('isKeepMenuOpenOnSelection')}
        isRTL={boolean('isRTL')}
        onMenuItemClick={(event, newValue) => {
          action('onMenuItemClick', event);
          setSelectedValue(newValue);
        }}
        options={options}
        placeholder={text('placeholder', 'select a value')}
        placement={select('placement', Object.values(PLACEMENT))}
        popupZIndex={number('popupZIndex')}
        selectedValue={selectedValue}
      />
    </Container>
  );
};

export const FlexibleDemo = () => {
  // Here the selected value and inputValue are tied together.
  // SelectedValue is updated when 'enter' on input is keyed down or new option is clicked/entered from menu.
  // Options are updated according to inputValue, only because inputValue has chosen to update with handleTypeaheadValueChange.

  const [selectedValue, setSelectedValue] = useState(null);
  const [inputValue, setInputValue] = useState(selectedValue);

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

  const handleTypeaheadValueChange = useCallback((value) => {
    action('handleTypeaheadValueChange')(value);
    setInputValue(value);
  }, []);

  return (
    <Container>
      <Typeahead
        ariaClearLabel={text('ariaClearLabel', 'clear search')}
        ariaInputLabel={text('ariaInputLabel', 'search stories')}
        disabled={boolean('disabled')}
        emptyText={text('emptyText', 'No stories found')}
        handleTypeaheadValueChange={handleTypeaheadValueChange}
        hasError={boolean('hasError')}
        hint={text('hint', 'default hint text')}
        isFlexibleValue={true}
        isKeepMenuOpenOnSelection={false}
        isRTL={boolean('isRTL')}
        onMenuItemClick={(event, newValue) => {
          action('onMenuItemClick', event);
          setSelectedValue(newValue);
        }}
        options={options}
        placeholder={text('placeholder', 'search for stories')}
        placement={select('placement', Object.values(PLACEMENT))}
        popupZIndex={number('popupZIndex')}
        selectedValue={selectedValue}
      />
    </Container>
  );
};

export const StrictDemo = () => {
  // Here we have a typeahead that will only update its selected value when a new menu option is selected.
  // Anything typed into the input purely tells options how to filter.
  // If the menu is closed, the input's value will return to the selectedValue.

  const [selectedValue, setSelectedValue] = useState('dog-2');
  const [inputValue, setInputValue] = useState(selectedValue);

  const options = useMemo(() => {
    if (!inputValue || inputValue.length === 0) {
      return nestedDropDownOptions;
    }

    return nestedDropDownOptions
      .map((optionSet) => {
        const matchingOptions = optionSet.options.filter(
          ({ label = '', value = '' }) =>
            label
              .toString()
              .toLowerCase()
              .startsWith(inputValue.toLowerCase().trim()) ||
            value
              .toString()
              .toLowerCase()
              .startsWith(inputValue.toLowerCase().trim())
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
    <DarkThemeProvider>
      <Container>
        <Typeahead
          ariaClearLabel={text('ariaClearLabel', 'clear input')}
          ariaInputLabel={text('ariaInputLabel', 'find a new font')}
          disabled={boolean('disabled')}
          emptyText={text('emptyText', 'No options available')}
          handleTypeaheadValueChange={handleTypeaheadValueChange}
          hasError={boolean('hasError')}
          hint={text('hint', 'default hint text')}
          isFlexibleValue={false}
          isKeepMenuOpenOnSelection={boolean('isKeepMenuOpenOnSelection')}
          isRTL={boolean('isRTL')}
          onMenuItemClick={(event, newValue) => {
            action('onMenuItemClick', event);
            setSelectedValue(newValue);
          }}
          options={options}
          placeholder={text('placeholder', 'select a value')}
          placement={select('placement', Object.values(PLACEMENT))}
          popupZIndex={number('popupZIndex')}
          selectedValue={selectedValue}
        />
      </Container>
    </DarkThemeProvider>
  );
};
