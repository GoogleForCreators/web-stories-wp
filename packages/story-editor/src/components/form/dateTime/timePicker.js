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
import { __ } from '@googleforcreators/i18n';
import { useEffect, useRef } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import Switch from '../switch';
import TimeZone from './timeZone';

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

const NumberInput = styled.input`
  min-height: 30px;
  box-shadow: 0 0 0 transparent;
  transition: box-shadow 0.1s linear;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border.defaultNormal};
  height: 28px;
  vertical-align: middle;
  background-color: ${({ theme }) => theme.colors.bg.tertiary};
  color: ${({ theme }) => theme.colors.fg.tertiary};

  &:active,
  &:focus {
    color: ${({ theme }) => theme.colors.fg.primary};
    border: 1px solid ${({ theme }) => theme.colors.border.defaultActive};
  }

  padding: 0;
  margin-right: 4px;
  text-align: center;
  width: 50%;
  max-width: 50px;

  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    margin: 0;
    appearance: none;
  }
`;

const TimeSeparator = styled.span`
  padding: 0 3px 0 0;
  color: #555d66;
`;

const InputGroup = styled.div`
  flex-basis: 100%;
`;

const StyledSwitch = styled(Switch)`
  width: 100px;
`;

function TimePicker({ onChange, is12Hour, localData, setLocalData }) {
  const onChangeEvent = (prop) => (evt) => {
    setLocalData({
      ...localData,
      [prop]: parseInt(evt.target.value),
    });
  };

  const getMaxHours = () => {
    return is12Hour ? 12 : 23;
  };

  const getMinHours = () => {
    return is12Hour ? 1 : 0;
  };

  const getHours = (value) => {
    const { am } = localData;
    if (!is12Hour) {
      return value;
    }
    return am === 'AM' ? value % 12 : ((value % 12) + 12) % 24;
  };

  const changeDate = (newDate, props = {}) => {
    setLocalData({ ...localData, ...props, date: newDate });
    onChange(newDate.toISOString());
  };

  const updateMinutes = () => {
    const { minutes, date } = localData;
    const value = parseInt(minutes);
    if (isNaN(value) || value < 0 || value > 59) {
      return;
    }
    if (date.getMinutes() !== minutes) {
      const newDate = date;
      newDate.setMinutes(minutes);
      changeDate(newDate);
    }
  };

  const updateHours = () => {
    const { hours, date } = localData;
    const value = parseInt(hours);
    if (isNaN(value) || value < getMinHours() || value > getMaxHours()) {
      return;
    }

    if (date.getHours() !== getHours(hours)) {
      const newDate = date;
      newDate.setHours(getHours(hours));
      changeDate(newDate);
    }
  };

  const updateAmPm = (_evt, useAM) => {
    const { am, date, hours } = localData;

    if (am === 'AM' && useAM) {
      return;
    }
    const newDate = date;

    if (useAM) {
      newDate.setHours(hours % 12);
    } else {
      newDate.setHours(((hours % 12) + 12) % 24);
    }

    changeDate(newDate, { am: useAM ? 'AM' : 'PM' });
  };

  const hours = useRef();
  useEffect(() => {
    hours.current.focus();
  }, []);

  const isAM = localData.am === 'AM';

  return (
    <TimeWrapper>
      <Fieldset>
        <Legend>{__('Time', 'web-stories')}</Legend>
        <InputRow>
          <InputGroup>
            <NumberInput
              ref={hours}
              aria-label={__('Hours', 'web-stories')}
              type="number"
              step={1}
              min={getMinHours()}
              max={getMaxHours()}
              value={parseInt(localData.hours)}
              onChange={onChangeEvent('hours')}
              onBlur={updateHours}
            />
            <TimeSeparator>{':'}</TimeSeparator>
            <NumberInput
              aria-label={__('Minutes', 'web-stories')}
              type="number"
              min={0}
              max={59}
              value={parseInt(localData.minutes)}
              onChange={onChangeEvent('minutes')}
              onBlur={updateMinutes}
            />
          </InputGroup>
          {is12Hour && (
            <InputGroup>
              <StyledSwitch
                groupLabel={__('AM or PM', 'web-stories')}
                name="time-picker-am-pm-switch"
                value={isAM}
                onLabel={__('AM', 'web-stories')}
                offLabel={__('PM', 'web-stories')}
                onChange={updateAmPm}
              />
            </InputGroup>
          )}
          <TimeZone />
        </InputRow>
      </Fieldset>
    </TimeWrapper>
  );
}

TimePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  is12Hour: PropTypes.bool,
  localData: PropTypes.shape({
    am: PropTypes.string.isRequired,
    hours: PropTypes.number.isRequired,
    minutes: PropTypes.number.isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
  }).isRequired,
  setLocalData: PropTypes.func.isRequired,
};

export default TimePicker;
