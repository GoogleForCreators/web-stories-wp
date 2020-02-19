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
 * Internal dependencies
 */
import RangeInput from '../rangeInput';
import { ReactComponent as PreviousIcon } from './smallRectangle.svg';
import { ReactComponent as NextIcon } from './largeRectangle.svg';

const RangeSlidertWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 430px;
  margin: 0 auto;
`;

const Button = styled.button.attrs(({ isDisabled }) => ({
  disabled: isDisabled,
}))`
  background-color: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
  width: 20px;
  height: 32px;

  ${({ disabled }) =>
    disabled &&
    `
		pointer-events: none;
		opacity: .3;
	`}
`;

const PreviousButton = styled(Button)`
  margin-right: 12px;

  svg {
    width: 11px;
    height: 19px;
  }
`;

const NextButton = styled(Button)`
  margin-left: 16px;
`;

function RangeSlider({ min = 0, max = 100, step = 10, value, onChange }) {
  const updateRnageValue = (addition) => {
    let newValue = value;
    newValue += addition;
    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;
    onChange(newValue);
  };

  return (
    <RangeSlidertWrapper>
      <PreviousButton
        isDisabled={value === min}
        onClick={() => updateRnageValue(-step)}
      >
        <PreviousIcon />
      </PreviousButton>
      <RangeInput
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(evt) => onChange(evt.target.valueAsNumber)}
        thumbSize={28}
        flexGrow={1}
      />
      <NextButton
        isDisabled={value === max}
        onClick={() => updateRnageValue(step)}
      >
        <NextIcon />
      </NextButton>
    </RangeSlidertWrapper>
  );
}

RangeSlider.propTypes = {
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
};

export default RangeSlider;
