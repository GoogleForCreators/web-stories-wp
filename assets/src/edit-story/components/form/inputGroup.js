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

// !LEGACY: DO NOT USE.

/**
 * External dependencies
 */
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Label from './label';
import Group from './group';

const Input = styled.input`
  color: ${({ theme }) => theme.colors.mg.v1};
  border: 1px solid;
  border-radius: 4px;
  font-size: 11px;
  line-height: 16px;
  width: 100px;
`;

function InputGroup({
  type,
  label,
  value,
  isMultiple,
  onChange,
  postfix,
  disabled,
  ...rest
}) {
  const placeholder = isMultiple ? __('( multiple )', 'web-stories') : '';
  const isCheckbox = type === 'checkbox';
  return (
    <Group disabled={disabled}>
      {label && <Label>{label}</Label>}
      <Input
        type={type}
        disabled={disabled}
        onChange={(evt) =>
          onChange(isCheckbox ? evt.target.checked : evt.target.value, evt)
        }
        onBlur={(evt) =>
          evt.target.form.dispatchEvent(new window.Event('submit'))
        }
        placeholder={placeholder}
        value={isCheckbox ? 'on' : value}
        checked={isCheckbox ? value : null}
        {...rest}
      />
      {postfix}
    </Group>
  );
}

InputGroup.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  isMultiple: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  postfix: PropTypes.string,
  disabled: PropTypes.bool,
};

InputGroup.defaultProps = {
  type: 'number',
  postfix: '',
  disabled: false,
  isMultiple: false,
};

export default InputGroup;
