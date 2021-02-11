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
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import TypeaheadOptions from '../';

const demoItems = [
  { value: '1', label: 'one' },
  { value: 'foo', label: 'two' },
  { value: false, label: 'invalid option' },
  { value: 'bar', label: 'three' },
  {
    value: 'edge_case',
    label: 'i am a very very very very very very very long label',
  },
  { value: 'dog', label: 'dog' },
  { value: 'bat', label: 'bat' },
  { value: 'cat', label: 'cat' },
  { value: 'lemur', label: 'lemur' },
  { value: 'rabbit', label: 'rabbit' },
  { value: 'sloth', label: 'sloth' },
  { value: 'turtle', label: 'turtle' },
  { value: 'horse', label: 'horse' },
];

export default {
  title: 'Dashboard/Components/Typeahead/TypeaheadOptions',
  component: TypeaheadOptions,
};
const TypeaheadOptionsWrapper = styled.div`
  width: 200px;
`;

export const _default = () => (
  <TypeaheadOptionsWrapper>
    <TypeaheadOptions
      handleFocusToInput={action('focus passed to input')}
      selectedIndex={-1}
      items={demoItems}
      onSelect={(item) => {
        action(`clicked on dropdown item ${item.value}`)(item);
      }}
    />
  </TypeaheadOptionsWrapper>
);
