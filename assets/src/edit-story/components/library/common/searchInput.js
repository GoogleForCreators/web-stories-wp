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
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import { ReactComponent as Close } from '../../../icons/close.svg';
import { TextInput } from '../../form';

const SearchField = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Search = styled(TextInput)`
  width: 100%;
  flex-grow: 1;
  border: none;
  border-radius: 4px;
  padding: 8px 16px 8px 16px;
`;

const CloseIcon = styled(Close)`
  width: 14px;
  height: 14px;
  color: ${({ theme }) => theme.colors.fg.v1};
`;

export default function SearchInput({
  value,
  placeholder,
  onChange,
  disabled,
}) {
  return (
    <SearchField>
      <Search
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        aria-label={__('Search from library', 'web-stories')}
        clear
        clearIcon={<CloseIcon />}
        showClearIconBackground={false}
      />
    </SearchField>
  );
}

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

SearchInput.defaultProps = {
  disabled: false,
};
