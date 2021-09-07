/*
 * Copyright 2021 Google LLC
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
import styled from 'styled-components';
import { useState } from '@web-stories-wp/react';

/**
 * Internal dependencies
 */
import Hierarchical from '..';

export default {
  title: 'Stories Editor/Components/Form/Hierarchical',
  component: Hierarchical,
};

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.primary};
  padding: 50px 200px;
`;

const DEFAULT_OPTIONS = [
  {
    id: 1,
    label: 'apple',
    checked: false,
    options: [
      { id: 'fitty', label: 'corgi', checked: true },
      {
        id: 'sitty',
        label: 'morgi',
        checked: true,
        options: [{ id: 'gritty', label: 'borky', checked: true }],
      },
    ],
  },
  { id: 2, label: 'banana', checked: false },
  { id: 3, label: 'cantaloupe', checked: true },
  {
    id: 4,
    label: 'papaya',
    checked: false,
    options: [
      {
        id: '100',
        label: 'trees',
        checked: true,
        options: [
          { id: '1001', label: 'mees', checked: true },
          { id: '10011', label: 'lees', checked: true },
        ],
      },
    ],
  },
  { id: 5, label: 'zebra fish', checked: true },
];

/*
1. set checked on the options
2. Make it work with childrens
 */

export const _default = () => {
  const [options, setOptions] = useState(DEFAULT_OPTIONS);

  const handleChange = (evt, newOption) => {
    const optionIndex = options.findIndex(
      (option) => option.id === newOption.id
    );

    if (optionIndex > -1) {
      setOptions((currentOptions) => [
        ...currentOptions.slice(0, optionIndex),
        newOption,
        ...currentOptions.slice(optionIndex + 1),
      ]);
    }
  };

  return (
    <Wrapper>
      <Hierarchical
        label="Categories"
        options={options}
        onChange={handleChange}
      />
    </Wrapper>
  );
};
