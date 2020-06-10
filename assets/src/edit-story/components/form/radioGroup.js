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
import { v4 as uuidv4 } from 'uuid';
import { useMemo } from 'react';

/**
 * Internal dependencies
 */
import { Radio as Selected, RadioSelected as UnSelected } from '../../icons';

const RadioButton = styled.label`
  display: block;
  min-height: 30px;
  margin: 10px 0;
`;

const RADIO_SIZE = 24;
const TEXT_OFFSET = 30;

const Label = styled.span`
  display: flex;
  position: relative;
  margin-bottom: 0;
  cursor: pointer;
  svg {
    width: ${RADIO_SIZE}px;
    height: ${RADIO_SIZE}px;
    margin-right: ${TEXT_OFFSET - RADIO_SIZE}px;
  }
`;

const Name = styled.span`
  line-height: 24px;
`;

const Radio = styled.input`
  opacity: 0;
  position: absolute;
  :focus + ${Label} {
    outline: -webkit-focus-ring-color auto 5px;
  }
`;

const Helper = styled.div`
  margin-left: ${TEXT_OFFSET}px;
  color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.54)};
  font-size: 12px;
  line-height: ${({ theme }) => theme.fonts.label.lineHeight};
`;

function RadioGroup({ onChange, value: selectedValue, options }) {
  const radioGroupId = useMemo(() => uuidv4(), []);
  return (
    <div>
      {options.map(({ value, name, helper }, i) => (
        <RadioButton key={value}>
          <Radio
            onChange={(evt) => onChange(evt.target.value, evt)}
            value={value}
            type="radio"
            checked={value === selectedValue}
            aria-labelledby={`radio-${i}-${radioGroupId}`}
          />
          <Label isActive={value === selectedValue}>
            {value === selectedValue ? <Selected /> : <UnSelected />}
            <Name id={`radio-${i}-${radioGroupId}`}>{name}</Name>
          </Label>
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
