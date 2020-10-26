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
import { useState } from 'react';
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import Typeahead from '../';

export default {
  title: 'Dashboard/Components/Typeahead',
  component: Typeahead,
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

const Container = styled.div`
  width: 400px;
  margin: 50px 100px;
  padding: 40px;
  background-color: white;
`;
export const _default = () => {
  const [value, setValue] = useState('');
  return (
    <Container>
      <Typeahead
        inputId={'demo-search-component'}
        items={items}
        onChange={(inputValue) => {
          if (!inputValue) {
            setValue('');
          }
          action(`input changed ${inputValue}`)(inputValue);
          setValue(inputValue);
        }}
        value={value}
        placeholder={text('placeholder', 'Search Stories')}
        ariaLabel={text('ariaLabel', 'my search for seasonings')}
        disabled={boolean('disabled')}
      />
    </Container>
  );
};
