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
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { rgba } from 'polished';

const RadioButton = styled.div`
  min-height: 30px;
  margin: 10px 0;
`;

const Radio = styled.input`
  opacity: 0;
  position: absolute;
  :focus + label {
    outline: -webkit-focus-ring-color auto 5px;
  }
`;

const RADIO_SIZE = 20;
const DOT_SIZE = 10;
const TEXT_OFFSET = 30;

const Label = styled.label`
  display: inline-block;
  position: relative;
  padding: 0 ${TEXT_OFFSET}px;
  margin-bottom: 0;
  cursor: pointer;
  vertical-align: bottom;
  &:before,
  &:after {
    position: absolute;
    content: '';
    border-radius: 50%;
  }
  &:before {
    left: 0;
    top: 0;
    width: ${RADIO_SIZE}px;
    height: ${RADIO_SIZE}px;
    border: 2px solid ${({ theme }) => theme.colors.mg.v2};
    ${({ isActive }) =>
      isActive &&
      css`
        border-color: #1a73e8;
      `}
  }
  &:after {
    top: 5px;
    left: 5px;
    width: ${DOT_SIZE}px;
    height: ${DOT_SIZE}px;
    transform: scale(0);
    background-color: ${({ theme }) => theme.colors.radio};
    ${({ isActive }) =>
      isActive &&
      css`
        transform: scale(1);
      `}
  }
`;

const Helper = styled.div`
  margin-left: ${TEXT_OFFSET}px;
  color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.54)};
  font-size: 12px;
  line-height: ${({ theme }) => theme.fonts.label.lineHeight};
`;

function RadioGroup({ onChange, value: selectedValue, options }) {
  return (
    <div>
      {options.map(({ value, name, helper }) => (
        <RadioButton key={`radio-${value}`}>
          <Radio
            id={`radio-${value}`}
            onChange={onChange}
            value={value}
            type="radio"
            checked={value === selectedValue}
          />
          {name && (
            <Label
              isActive={value === selectedValue}
              htmlFor={`radio-${value}`}
            >
              {name}
            </Label>
          )}
          {helper && <Helper>{helper}</Helper>}
        </RadioButton>
      ))}
    </div>
  );
}

RadioGroup.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
};

export default RadioGroup;
