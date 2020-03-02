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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Label from './label';
import Group from './group';

const Container = styled(Group)`
  flex-basis: ${({ flexBasis }) => flexBasis};
  ${({ flexGrow }) =>
    flexGrow &&
    `flex-grow: 1;
  `};
  margin-bottom: 0;
`;

const Select = styled.select`
  width: 100%;
  margin: 0;
  background-color: ${({ theme }) => rgba(theme.colors.bg.v0, 0.3)} !important;
  border: 0;
  border-radius: 4px !important;
  color: ${({ theme }) => theme.colors.fg.v1} !important;
  font-family: ${({ theme }) => theme.fonts.label.family};
  font-size: ${({ theme }) => theme.fonts.label.size};
  line-height: ${({ theme }) => theme.fonts.label.lineHeight};
  font-weight: ${({ theme }) => theme.fonts.label.weight};

  &:focus {
    box-shadow: none !important;
  }
`;

const Option = styled.option`
  height: 48px;
`;

function SelectMenu({
  label,
  options,
  value,
  isMultiple,
  onChange,
  postfix,
  disabled,
  flexGrow,
  flexBasis,
}) {
  return (
    <Container disabled={disabled} flexBasis={flexBasis} flexGrow={flexGrow}>
      {label && <Label>{label}</Label>}
      <Select
        disabled={disabled}
        value={value}
        onChange={(evt) => onChange(evt.target.value, evt)}
        onBlur={(evt) =>
          evt.target.form.dispatchEvent(new window.Event('submit'))
        }
      >
        {isMultiple ? (
          <Option
            key="multiple"
            dangerouslySetInnerHTML={{
              __html: __('( multiple )', 'web-stories'),
            }}
          />
        ) : (
          options &&
          options.map(({ name, value: optValue }) => (
            <Option
              key={optValue}
              value={optValue}
              dangerouslySetInnerHTML={{ __html: name }}
            />
          ))
        )}
      </Select>
      {postfix}
    </Container>
  );
}

SelectMenu.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  isMultiple: PropTypes.bool,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  postfix: PropTypes.string,
  disabled: PropTypes.bool,
  flexGrow: PropTypes.bool,
  flexBasis: PropTypes.number,
};

SelectMenu.defaultProps = {
  postfix: '',
  disabled: false,
  isMultiple: false,
  flexGrow: true,
  flexBasis: 100,
};

export default SelectMenu;
