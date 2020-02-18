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
import { TextField, InputAdornment, FormControl } from '@material-ui/core';
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Group from './group';

const FormControlStyled = styled(FormControl)`
  width: 100%;
  margin: 10px 0px !important;
`;
const StyledInput = styled(TextField)`
  input {
    border: 0;
    box-shadow: 0 0 0 transparent;
    background: none;
    min-height: auto;
    color: currentColor;
    padding: 6px 0 7px;
    &:focus,
    &:active,
    &:hover {
      box-shadow: 0 0 0 transparent;
    }
  }
  .MuiOutlinedInput-input {
    padding: 18.5px 14px;
  }
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

  let InputProps = {};
  if (postfix) {
    InputProps = {
      endAdornment: <InputAdornment position="end">{postfix}</InputAdornment>,
    };
  }

  return (
    <Group disabled={disabled}>
      <FormControlStyled>
        <StyledInput
          label={label}
          InputProps={InputProps}
          variant="outlined"
          type={type}
          disabled={disabled}
          endAdornment={
            <InputAdornment position="end">{postfix}</InputAdornment>
          }
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
      </FormControlStyled>
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
