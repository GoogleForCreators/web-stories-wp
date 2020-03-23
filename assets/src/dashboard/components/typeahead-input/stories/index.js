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
import { boolean, number, text } from '@storybook/addon-knobs';
import { useState } from 'react';
/**
 * Internal dependencies
 */
import TypeaheadInput from '..';
import getTypeaheadOptions from '../../typeahead-options/utils/getTypeaheadOptions';

export default {
  title: 'Dashboard/Components/TypeaheadInput',
  component: TypeaheadInput,
};

const items = [
  { label: 'Pepper', value: 'pepper' },
  { label: 'Lemon', value: 'lemon' },
  { label: 'Salt', value: 'salt' },
  { label: 'Paprika', value: 'paprika' },
  { label: 'Oregano', value: 'oregano' },
  { label: 'Lemon Salt', value: 'lemonsalt' },
  { label: 'Basil', value: 'basil' },
  { label: 'water', value: 'agua' },
];
export const _default = () => {
  const [value, setValue] = useState('');
  return (
    <TypeaheadInput
      inputId={'demo-search-component'}
      items={items}
      onChange={(inputValue) => {
        if (!inputValue) {
          setValue('');
        }
        action(`input changed ${inputValue}`)(inputValue);
      }}
      error={text('error')}
      value={value}
      placeholder={text('placeholder', 'search something!')}
      ariaLabel={text('ariaLabel', 'my search for seasonings')}
      displayResultQuantity={number('displayResultQuantity')}
      disabled={boolean('disabled')}
    />
  );
};

export const _filterLoadedSearchItems = () => {
  const [value, setValue] = useState('Cucumbers');
  return (
    <TypeaheadInput
      inputId={'demo-search-component'}
      items={getTypeaheadOptions(items, value)}
      onChange={(inputValue) => {
        if (!inputValue) {
          setValue('');
        }
        action(`input changed ${inputValue}`)(inputValue);
        setValue(inputValue);
      }}
      error={text('error')}
      value={value}
      placeholder={text('placeholder', 'search something!')}
      ariaLabel={text('ariaLabel', 'my search for seasonings')}
      displayResultQuantity={number('displayResultQuantity')}
      disabled={boolean('disabled')}
    />
  );
};
