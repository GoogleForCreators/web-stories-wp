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
import React, { useState } from 'react';
import styled, { css } from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';

const TimeWrapper = styled.div`
  margin-bottom: 1em;
  padding: 0 20px;
`;

const Fieldset = styled.fieldset`
  margin-top: 0.5em;
  position: relative;
`;

const Legend = styled.legend`
  position: absolute;
  top: -999em;
  left: -999em;
`;

const InputRow = styled.div`
  display: flex;
`;

const inputCSS = css`
  min-height: 30px;
  box-shadow: 0 0 0 transparent;
  transition: box-shadow 0.1s linear;
  border-radius: 4px;
  border: 1px solid #7e8993;
  box-sizing: border-box;
  height: 28px;
  vertical-align: middle;
  background-color: #fff;
  color: #32373c;
`;

const NumberInput = styled.input`
  ${inputCSS}
  padding: 0;
  margin-right: 4px;
  text-align: center;
  width: ${({ width }) => (width ? width : 35)}px;
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    margin: 0;
    appearance: none;
  }
`;

const TimeSeparator = styled.span`
  display: inline-block;
  padding: 0 3px 0 0;
  color: #555d66;
`;

const Button = styled.button`
  display: inline-flex;
  text-decoration: none;
  font-size: 13px;
  margin: 0;
  border: 0;
  cursor: pointer;
  transition: box-shadow 0.1s linear;
  padding: 0 10px;
  line-height: 2;
  height: 30px;
  border-radius: 3px;
  white-space: nowrap;
  border-width: 1px;
  border-style: solid;
  color: rgb(0, 117, 175);
  border-color: rgb(0, 117, 175);
  background: #f3f5f6;

  &:focus {
    outline: 2px solid transparent;
    background: #f3f5f6;
    color: rgb(0, 93, 140);
    border-color: rgb(0, 118, 177);
    box-shadow: 0 0 0 1px rgb(0, 118, 177);
    text-decoration: none;
  }
  ${({ isToggled }) =>
    isToggled &&
    `
		background: #edeff0;
    border-color: #8f98a1;
    box-shadow: inset 0 2px 5px -3px #555d66;
	`}
`;

const InputGroup = styled.div`
  flex-basis: 96px;
`;

const AMButton = styled(Button)`
  margin-right: -1px;
  border-radius: 3px 0 0 3px;
`;

const PMButton = styled(Button)`
  margin-left: -1px;
  border-radius: 0 3px 3px 0;
`;

function TimePicker({ currentTime, onChange, is12Hour }) {
  const selectedTime = currentTime ? new Date(currentTime) : new Date();
  const initialHours = selectedTime.getHours();
  const [state, setState] = useState({
    minutes: selectedTime.getMinutes(),
    am: initialHours < 12 ? 'AM' : 'PM',
    hours: is12Hour ? initialHours % 12 || 12 : initialHours,
    date: selectedTime,
  });

  const onChangeEvent = (prop) => (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [prop]: value === '' ? '' : ('0' + value).slice(-2),
    });
  };

  const getMaxHours = () => {
    return is12Hour ? 12 : 23;
  };

  const getMinHours = () => {
    return is12Hour ? 1 : 0;
  };

  const getHours = (value) => {
    const { am } = state;
    if (!is12Hour) {
      return value;
    }
    return am === 'AM' ? value % 12 : ((value % 12) + 12) % 24;
  };

  const changeDate = (newDate, props = {}) => {
    setState({ ...state, ...props, date: newDate });
    onChange(newDate.toISOString());
  };

  const updateMinutes = () => {
    const { minutes, date } = state;
    if (isNaN(minutes) || minutes < 0 || minutes > 59) {
      return;
    }
    const newDate = date;
    newDate.setMinutes(minutes);
    changeDate(newDate);
  };

  const updateHours = () => {
    const { hours, date } = state;
    if (isNaN(hours) || hours < getMinHours() || hours > getMaxHours()) {
      return;
    }

    const newDate = date;
    newDate.setHours(getHours(hours));
    changeDate(newDate);
  };

  const updateAmPm = (value) => () => {
    const { am, date, hours } = state;
    if (am === value) {
      return;
    }
    const newDate = date;
    if (value === 'PM') {
      newDate.setHours(((hours % 12) + 12) % 24);
    } else {
      newDate.setHours(hours % 12);
    }
    changeDate(newDate, { am: value });
  };

  return (
    <TimeWrapper>
      <Fieldset>
        <Legend>{__('Time', 'web-stories')}</Legend>
        <InputRow>
          <InputGroup>
            <NumberInput
              aria-label={__('Hours', 'web-stories')}
              type="number"
              step={1}
              min={getMinHours()}
              max={getMaxHours()}
              value={state.hours}
              onChange={onChangeEvent('hours')}
              onBlur={updateHours}
            />
            <TimeSeparator>{':'}</TimeSeparator>
            <NumberInput
              aria-label={__('Minutes', 'web-stories')}
              type="number"
              min={0}
              max={59}
              value={state.minutes}
              onChange={onChangeEvent}
              onBlur={updateMinutes}
            />
          </InputGroup>
          {is12Hour && (
            <InputGroup>
              <AMButton
                type="button"
                isToggled={state.am === 'AM'}
                onClick={updateAmPm('AM')}
              >
                {__('AM', 'web-stories')}
              </AMButton>
              <PMButton
                type="button"
                isToggled={state.am === 'PM'}
                onClick={updateAmPm('PM')}
              >
                {__('PM', 'web-stories')}
              </PMButton>
            </InputGroup>
          )}
        </InputRow>
      </Fieldset>
    </TimeWrapper>
  );
}

TimePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  currentTime: PropTypes.string,
  is12Hour: PropTypes.bool,
};

export default TimePicker;
