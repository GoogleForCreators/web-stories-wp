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
import { boolean, select, text } from '@storybook/addon-knobs';
import { useState } from 'react';
/**
 * Internal dependencies
 */
import { DarkThemeProvider } from '../../../storybookUtils';
import { PLACEMENT } from '../../popup';
import { DropDown } from '..';
import { basicDropDownOptions } from './sampleData';

export default {
  title: 'DesignSystem/Components/DropDown',
};

export const _default = () => {
  const [selectedValue, setSelectedValue] = useState(
    basicDropDownOptions[2].value
  );
  return (
    <DarkThemeProvider>
      <DropDown
        emptyText={'No options available'}
        options={basicDropDownOptions}
        hint={text('hint', 'default hint text')}
        placeholder={text('placeholder', 'select a value')}
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
      />
    </DarkThemeProvider>
  );
};

export const LightTheme = () => {
  const [selectedValue, setSelectedValue] = useState(null);

  return (
    <DropDown
      emptyText={'No options available'}
      options={basicDropDownOptions}
      hint={text('hint', 'default hint text')}
      placeholder={text('placeholder', 'select a value')}
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
    />
  );
};
