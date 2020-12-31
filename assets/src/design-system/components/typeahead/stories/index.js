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
import styled, { css } from 'styled-components';
import { useState } from 'react';

/**
 * Internal dependencies
 */
import { DarkThemeProvider } from '../../../storybookUtils';
import { PLACEMENT } from '../../popup';
import { Text } from '../../typography';
import { Typeahead } from '..';
import {
  basicDropDownOptions,
  nestedDropDownOptions,
  reallyLongOptions,
} from './sampleData';

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
  return (
    <DarkThemeProvider>
      <Container>
        <Text>
          {
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus luctus ex eu maximus. Nam cursus nulla massa, vel porta nisi mattis et. Vivamus vitae massa nulla. Sed enim velit, iaculis ut pharetra vitae, sagittis et dui. In sollicitudin lectus vel rhoncus auctor. Morbi pulvinar nisl sed mi fringilla, vitae bibendum felis egestas.'
          }
        </Text>
        <Typeahead
          handleTypeaheadValueChange={(value) => {
            action('handleTypeaheadValueChange')(value);
          }}
          emptyText={'No options available'}
          options={basicDropDownOptions}
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

  return (
    <Container>
      <Typeahead
        emptyText={'No options available'}
        options={basicDropDownOptions}
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

const shortenedOptions = [...basicDropDownOptions.slice(0, 3)];
export const ShortMenu = () => {
  const [selectedValue, setSelectedValue] = useState(null);

  return (
    <Container>
      <Typeahead
        emptyText={'No options available'}
        options={shortenedOptions}
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

export const NoOptionsMenu = () => {
  const [selectedValue, setSelectedValue] = useState(null);

  return (
    <Container>
      <DropDown
        emptyText={'No options available'}
        options={[]}
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

export const ReallyLongLabelsMenu = () => {
  const [selectedValue, setSelectedValue] = useState(null);

  return (
    <Container narrow>
      <DropDown
        emptyText={'No options available'}
        options={reallyLongOptions}
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

  return (
    <Container>
      <DropDown
        emptyText={'No options available'}
        options={nestedDropDownOptions}
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
