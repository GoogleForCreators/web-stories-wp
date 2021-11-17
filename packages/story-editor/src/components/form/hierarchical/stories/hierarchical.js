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
import { useCallback, useMemo, useState } from '@web-stories-wp/react';

/**
 * Internal dependencies
 */
import Hierarchical from '..';
import { makeFlatOptionTree } from '../utils';

export default {
  title: 'Stories Editor/Components/Form/Hierarchical',
  component: Hierarchical,
};

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.primary};
  padding: 50px 200px;
`;

const OPTIONS = [
  { id: 1, label: 'apple', checked: false },
  { id: 'fitty', label: 'corgi', checked: true, parent: 1 },
  { id: 'sixty', label: 'morgi', checked: true, parent: 1 },
  { id: 'gritty', label: 'borky', checked: true, parent: 'sixty' },
  { id: 2, label: 'banana', checked: false },
  { id: 3, label: 'cantaloupe', checked: true },
  { id: 4, label: 'papaya', checked: false },
  { id: '100', label: 'trees', checked: true, parent: 4 },
  { id: '1001', label: 'porgi', checked: true, parent: '100' },
  { id: '10011', label: 'hal', checked: true, parent: '100' },
  { id: 5, label: 'zebra fish', checked: true },
];

export const _default = () => {
  const [options, setOptions] = useState(OPTIONS);
  const [searchText, setSearchText] = useState('');

  const filteredOptions = useMemo(
    () => makeFlatOptionTree(options, searchText),
    [options, searchText]
  );

  const handleInputChange = useCallback((val) => setSearchText(val), []);

  const handleChange = useCallback((evt, { id, checked }) => {
    setOptions((currentOptions) => {
      const index = currentOptions.findIndex((option) => option.id === id);

      return [
        ...currentOptions.slice(0, index),
        { ...currentOptions[index], checked },
        ...currentOptions.slice(index + 1),
      ];
    });
  }, []);

  return (
    <Wrapper>
      <Hierarchical
        inputValue={searchText}
        onInputChange={handleInputChange}
        label="Categories"
        placeholder="Start Typing"
        noOptionsText="No results found"
        options={filteredOptions}
        onChange={handleChange}
      />
    </Wrapper>
  );
};
