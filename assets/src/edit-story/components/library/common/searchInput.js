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
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { Dashicon } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { alpha } from '../../../theme';

/**
 * Search Input
 */

const Icon = styled(Dashicon)`
  position: absolute;
  top: 8px;
  left: 10px;
  fill: ${({ theme }) => theme.colors.mg.v2};
`;

const SearchField = styled.div`
  position: relative;
`;

const Search = styled.input.attrs({ type: 'text' })`
  width: 100%;
  background: ${({ theme }) => alpha(theme.colors.fg.v1, 0.1)} !important;
  border-color: ${({ theme }) => theme.colors.mg.v1} !important;
  color: ${({ theme }) => theme.colors.mg.v2} !important;
  padding: 2px 10px 2px 33px !important;

  &::placeholder {
    color: ${({ theme }) => theme.colors.mg.v2};
  }
`;

export default function SearchInput({ value, placeholder, onChange }) {
  return (
    <SearchField>
      <Icon icon="search" />
      <Search value={value} placeholder={placeholder} onChange={onChange} />
    </SearchField>
  );
}

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
