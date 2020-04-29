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
import { rgba } from 'polished';

const SearchField = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Search = styled.input.attrs({ type: 'text' })`
  width: 100%;
  background: ${({ theme }) => rgba(theme.colors.fg.v0, 0.3)};
  border: none;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.fg.v1};
  padding: 8px 16px 8px 16px;
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-size: ${({ theme }) => theme.fonts.body1.size};
  letter-spacing: ${({ theme }) => theme.fonts.body1.letterSpacing};
  line-height: ${({ theme }) => theme.fonts.body1.lineHeight};
  &::placeholder {
    color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.54)};
  }
  &:focus {
    background: ${({ theme }) => theme.colors.bg.v13};
    color: ${({ theme }) => theme.colors.bg.v0};
  }
  &:focus::placeholder {
    color: ${({ theme }) => rgba(theme.colors.bg.v0, 0.54)};
  }
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
