// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable header/header */
/* Disable reason: This file is based on Gutenberg Datepicker */

/**
 * External dependencies
 */
import React, { useState } from 'react';
import moment from 'moment';
import styled, { css } from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { TIMEZONELESS_FORMAT } from '../../../constants';

const DateTimeWrapper = styled.div`
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

const SelectInput = styled.select`
  font-size: 13px;
  line-height: 1.38461538;
  color: #32373c;
  border-color: #7e8993;
  box-shadow: none;
  border-radius: 3px;
  padding: 3px 24px 3px 8px;
  min-height: 30px;
  max-width: 25rem;
  vertical-align: middle;
  appearance: none;
  background: #fff
    url(data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%206l5%205%205-5%202%201-7%207-7-7%202-1z%22%20fill%3D%22%23555%22%2F%3E%3C%2Fsvg%3E)
    no-repeat right 5px top 55%;
  background-size: 16px 16px;
  cursor: pointer;
  margin-right: 4px;
`;

const DateTimeSeparator = styled.span`
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

function DateTimePicker({ currentTime, onChange, is12Hour }) {
  const selectedTime = currentTime ? moment(currentTime) : moment();
  const [state, setState] = useState({
    day: selectedTime.format('DD'),
    month: selectedTime.format('MM'),
    year: selectedTime.format('YYYY'),
    minutes: selectedTime.format('mm'),
    am: selectedTime.format('A'),
    hours: selectedTime.format(is12Hour ? 'hh' : 'HH'),
    date: selectedTime,
  });

  const onChangeEvent = (prop) => (evt) => {
    setState({ ...state, [prop]: evt.target.value });
  };

  const onChangeMinutes = (evt) => {
    const minutes = evt.target.value;
    setState({
      ...state,
      minutes: minutes === '' ? '' : ('0' + minutes).slice(-2),
    });
  };

  const getMaxHours = () => {
    return is12Hour ? 12 : 23;
  };

  const getMinHours = () => {
    return is12Hour ? 1 : 0;
  };

  const changeDate = (newDate, props = {}) => {
    const dateWithStartOfMinutes = newDate.clone().startOf('minute');
    setState({ ...state, ...props, date: dateWithStartOfMinutes });
    onChange(newDate.format(TIMEZONELESS_FORMAT));
  };

  const updateMinutes = () => {
    const { minutes, date } = state;
    const value = parseInt(minutes);
    if (isNaN(value) || value < 0 || value > 59 || minutes === value) {
      return;
    }
    const newDate = date.clone().minutes(value);
    changeDate(newDate);
  };

  const updateHours = () => {
    const { am, hours, date } = state;
    const value = parseInt(hours);
    if (
      isNaN(value) ||
      (is12Hour && (value < 1 || value > 12)) ||
      (!is12Hour && (value < 0 || value > 23)) ||
      hours === value
    ) {
      return;
    }

    const newDate = is12Hour
      ? date.clone().hours(am === 'AM' ? value % 12 : ((value % 12) + 12) % 24)
      : date.clone().hours(value);
    changeDate(newDate);
  };

  const updateDay = () => {
    const { day, date } = state;
    const value = parseInt(day);
    if (isNaN(value) || value < 1 || value > 31 || day === value) {
      return;
    }
    const newDate = date.clone().date(value);
    changeDate(newDate);
  };

  const updateMonth = () => {
    const { month, date } = state;
    const value = parseInt(month);
    if (isNaN(value) || value < 1 || value > 12 || month === value) {
      return;
    }
    const newDate = date.clone().month(value - 1);
    changeDate(newDate);
  };

  const updateYear = () => {
    const { year, date } = state;
    const value = parseInt(year);
    if (isNaN(value) || value < 0 || value > 9999 || year === value) {
      return;
    }
    const newDate = date.clone().year(value);
    changeDate(newDate);
  };

  const updateAmPm = (value) => () => {
    const { am, date, hours } = state;
    if (am === value) {
      return;
    }
    let newDate;
    if (value === 'PM') {
      newDate = date.clone().hours(((parseInt(hours) % 12) + 12) % 24);
    } else {
      newDate = date.clone().hours(parseInt(hours) % 12);
    }
    changeDate(newDate, { am: value });
  };

  const renderDay = (day) => {
    return (
      <div key="render-day">
        <NumberInput
          aria-label={__('Day', 'web-stories')}
          type="number"
          value={day}
          step={1}
          min={1}
          onChange={onChangeEvent('day')}
          onBlur={updateDay}
        />
      </div>
    );
  };

  const renderMonth = (month) => {
    return (
      <div key="render-month">
        <SelectInput
          aria-label={__('Month', 'web-stories')}
          value={month}
          onChange={onChangeEvent('month')}
          onBlur={updateMonth}
        >
          <option value="01">{__('January', 'web-stories')}</option>
          <option value="02">{__('February', 'web-stories')}</option>
          <option value="03">{__('March', 'web-stories')}</option>
          <option value="04">{__('April', 'web-stories')}</option>
          <option value="05">{__('May', 'web-stories')}</option>
          <option value="06">{__('June', 'web-stories')}</option>
          <option value="07">{__('July', 'web-stories')}</option>
          <option value="08">{__('August', 'web-stories')}</option>
          <option value="09">{__('September', 'web-stories')}</option>
          <option value="10">{__('October', 'web-stories')}</option>
          <option value="11">{__('November', 'web-stories')}</option>
          <option value="12">{__('December', 'web-stories')}</option>
        </SelectInput>
      </div>
    );
  };

  const renderDayMonthFormat = (is12HourFormat) => {
    const { day, month } = state;
    const layout = [renderDay(day), renderMonth(month)];
    return is12HourFormat ? layout : layout.reverse();
  };

  return (
    <DateTimeWrapper>
      <Fieldset>
        <Legend>{__('Date', 'web-stories')}</Legend>
        <InputRow>
          {renderDayMonthFormat(is12Hour)}
          <NumberInput
            aria-label={__('Year', 'web-stories')}
            type="number"
            step={1}
            value={state.year}
            onChange={onChangeEvent('year')}
            onBlur={updateYear}
            width={55}
          />
        </InputRow>
      </Fieldset>

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
            <DateTimeSeparator>{':'}</DateTimeSeparator>
            <NumberInput
              aria-label={__('Minutes', 'web-stories')}
              type="number"
              min={0}
              max={59}
              value={state.minutes}
              onChange={onChangeMinutes}
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
    </DateTimeWrapper>
  );
}

DateTimePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  currentTime: PropTypes.string,
  is12Hour: PropTypes.bool,
};

export default DateTimePicker;
