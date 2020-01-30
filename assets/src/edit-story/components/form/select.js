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

/**
 * WordPress dependencies
 */
import {__} from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Label from './label';
import Group from './group';

const Select = styled.select`
  width: 100px;
`;

function SelectMenu({
  label,
  options,
  value,
  isMultiple,
  onChange,
  postfix,
  disabled,
}) {
  return (
    <Group disabled={disabled}>
      <Label>{label}</Label>
      <Select
        disabled={disabled}
        value={value}
        onChange={evt => onChange(evt.target.value, evt)}
        onBlur={evt =>
          evt.target.form.dispatchEvent(new window.Event('submit'))
        }
      >
        {isMultiple ? (
          <option
            key="multiple"
            dangerouslySetInnerHTML={{
              __html: __('( multiple )', 'web-stories'),
            }}
          />
        ) : (
          options &&
          options.map(({name, value: optValue}) => (
            <option
              key={optValue}
              value={optValue}
              dangerouslySetInnerHTML={{__html: name}}
            />
          ))
        )}
      </Select>
      {postfix}
    </Group>
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
};

SelectMenu.defaultProps = {
  postfix: '',
  disabled: false,
  isMultiple: false,
};

export default SelectMenu;
