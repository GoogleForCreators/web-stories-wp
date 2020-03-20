// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable header/header */
/* Disable reason: This file is based on Gutenberg Datepicker */

/**
 * External dependencies
 */
import { useState } from 'react';
import moment from 'moment';
import styled, { css } from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
// @todo Replace these with local components.
import { ButtonGroup, Button } from '@wordpress/components';
import PropTypes from 'prop-types';

const TIMEZONELESS_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

const DateTimeWrapper = styled.div`
  margin-bottom: 1em;
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
  padding: 2px;
  margin-right: 4px;
  text-align: center;
  width: ${({ width }) => width}px;
`;

const SelectInput = styled.select`
  font-size: 13px;
  line-height: 1.38461538;
  color: #32373c;
  border-color: #7e8993;
  box-shadow: none;
  border-radius: 3px;
  padding: 3px 24px 3px 8px;
  min-height: 28px;
  max-width: 25rem;
  vertical-align: middle;
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

function TimePicker({ currentTime, onChange, is12Hour }) {
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

  // @todo Add callbacks.
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

  const changeDate = (newDate) => {
    const dateWithStartOfMinutes = newDate.clone().startOf('minute');
    setState({ date: dateWithStartOfMinutes });
    onChange(newDate.format(TIMEZONELESS_FORMAT));
  };

  const updateMinutes = () => {
    const { minutes, date } = state;
    const value = parseInt(minutes);
    if (isNaN(value) || value < 0 || value > 59) {
      //this.syncState( this.props );
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
      (!is12Hour && (value < 0 || value > 23))
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
    if (isNaN(value) || value < 1 || value > 31) {
      //this.syncState( this.props );
      return;
    }
    const newDate = date.clone().date(value);
    changeDate(newDate);
  };

  const updateMonth = () => {
    const { month, date } = state;
    const value = parseInt(month);
    if (isNaN(value) || value < 1 || value > 12) {
      //this.syncState( this.props );
      return;
    }
    const newDate = date.clone().month(value - 1);
    changeDate(newDate);
  };

  const updateYear = () => {
    const { year, date } = state;
    const value = parseInt(year);
    if (isNaN(value) || value < 0 || value > 9999) {
      //this.syncState( this.props );
      return;
    }
    const newDate = date.clone().year(value);
    changeDate(newDate);
  };

  const updateAmPm = (value) => {
    return () => {
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
      changeDate(newDate);
    };
  };

  const renderDay = (day) => {
    return (
      <div
        key="render-day"
        className="components-datetime__time-field components-datetime__time-field-day"
      >
        <NumberInput
          aria-label={__('Day', 'web-stories')}
          className="components-datetime__time-field-day-input"
          type="number"
          value={day}
          step={1}
          min={1}
          onChange={onChangeEvent('day')}
          onBlur={updateDay}
          width={35}
        />
      </div>
    );
  };

  const renderMonth = (month) => {
    return (
      <div
        key="render-month"
        className="components-datetime__time-field components-datetime__time-field-month"
      >
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
          <div className="components-datetime__time-field components-datetime__time-field-year">
            <NumberInput
              aria-label={__('Year', 'web-stories')}
              className="components-datetime__time-field-year-input"
              type="number"
              step={1}
              value={state.year}
              onChange={onChangeEvent('year')}
              onBlur={updateYear}
              width={55}
            />
          </div>
        </InputRow>
      </Fieldset>

      <Fieldset>
        <Legend>{__('Time', 'web-stories')}</Legend>
        <InputRow>
          <div className="components-datetime__time-field components-datetime__time-field-time">
            <NumberInput
              aria-label={__('Hours', 'web-stories')}
              className="components-datetime__time-field-hours-input"
              type="number"
              step={1}
              min={getMinHours()}
              max={getMaxHours()}
              value={state.hours}
              onChange={onChangeEvent('hours')}
              onBlur={updateHours}
            />
            <DateTimeSeparator aria-hidden="true">{':'}</DateTimeSeparator>
            <NumberInput
              aria-label={__('Minutes', 'web-stories')}
              className="components-datetime__time-field-minutes-input"
              type="number"
              min={0}
              max={59}
              value={state.minutes}
              onChange={onChangeMinutes}
              onBlur={updateMinutes}
            />
          </div>
          {is12Hour && (
            <ButtonGroup className="components-datetime__time-field components-datetime__time-field-am-pm">
              <Button
                isPrimary={state.am === 'AM'}
                isSecondary={state.am !== 'AM'}
                onClick={updateAmPm('AM')}
                className="components-datetime__time-am-button"
              >
                {__('AM', 'web-stories')}
              </Button>
              <Button
                isPrimary={state.am === 'PM'}
                isSecondary={state.am !== 'PM'}
                onClick={updateAmPm('PM')}
                className="components-datetime__time-pm-button"
              >
                {__('PM', 'web-stories')}
              </Button>
            </ButtonGroup>
          )}
        </InputRow>
      </Fieldset>
    </DateTimeWrapper>
  );
}

TimePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  currentTime: PropTypes.object,
  is12Hour: PropTypes.bool,
};

export default TimePicker;
