// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable header/header */
/* Disable reason: This file is based on Gutenberg Datepicker */

/**
 * External dependencies
 */
import { useState } from 'react';
import moment from 'moment';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ButtonGroup, Button } from '@wordpress/components';

const TIMEZONELESS_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

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

  // @todo Add callback.
  const onChangeEvent = (prop) => (evt) => {
    setState({ ...state, [prop]: evt.target.value });
  };

  const changeDate = (newDate) => {
    const dateWithStartOfMinutes = newDate.clone().startOf('minute');
    setState({ date: dateWithStartOfMinutes });
    onChange(newDate.format(TIMEZONELESS_FORMAT));
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

  const renderDay = (day) => {
    return (
      <div
        key="render-day"
        className="components-datetime__time-field components-datetime__time-field-day"
      >
        <input
          aria-label={__('Day', 'web-stories')}
          className="components-datetime__time-field-day-input"
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
      <div
        key="render-month"
        className="components-datetime__time-field components-datetime__time-field-month"
      >
        <select
          aria-label={__('Month')}
          className="components-datetime__time-field-month-select"
          value={month}
          onChange={onChangeEvent('month')}
          onBlur={updateMonth}
        >
          <option value="01">{__('January')}</option>
          <option value="02">{__('February')}</option>
          <option value="03">{__('March')}</option>
          <option value="04">{__('April')}</option>
          <option value="05">{__('May')}</option>
          <option value="06">{__('June')}</option>
          <option value="07">{__('July')}</option>
          <option value="08">{__('August')}</option>
          <option value="09">{__('September')}</option>
          <option value="10">{__('October')}</option>
          <option value="11">{__('November')}</option>
          <option value="12">{__('December')}</option>
        </select>
      </div>
    );
  };

  const renderDayMonthFormat = (is12HourFormat) => {
    const { day, month } = state;
    const layout = [renderDay(day), renderMonth(month)];
    return is12HourFormat ? layout : layout.reverse();
  };

  return (
    <div>
      <fieldset>
        <legend className="components-datetime__time-legend invisible">
          {__('Date')}
        </legend>
        <div className="components-datetime__time-wrapper">
          {renderDayMonthFormat(is12Hour)}
          {/*<div className="components-datetime__time-field components-datetime__time-field-year">
            <input
              aria-label={__('Year')}
              className="components-datetime__time-field-year-input"
              type="number"
              step={1}
              value={state.year}
              onChange={this.onChangeYear}
              onBlur={this.updateYear}
            />
          </div>*/}
        </div>
      </fieldset>

      {/* <fieldset>
        <legend className="components-datetime__time-legend invisible">
          {__('Time')}
        </legend>
        <div className="components-datetime__time-wrapper">
          <div className="components-datetime__time-field components-datetime__time-field-time">
            <input
              aria-label={__('Hours')}
              className="components-datetime__time-field-hours-input"
              type="number"
              step={1}
              min={this.getMinHours()}
              max={this.getMaxHours()}
              value={state.hours}
              onChange={this.onChangeHours}
              onBlur={this.updateHours}
            />
            <span
              className="components-datetime__time-separator"
              aria-hidden="true"
            >
              {':'}
            </span>
            <input
              aria-label={__('Minutes')}
              className="components-datetime__time-field-minutes-input"
              type="number"
              min={0}
              max={59}
              value={state.minutes}
              onChange={this.onChangeMinutes}
              onBlur={this.updateMinutes}
            />
          </div>
          {is12Hour && (
            <ButtonGroup className="components-datetime__time-field components-datetime__time-field-am-pm">
              <Button
                isPrimary={state.am === 'AM'}
                isSecondary={state.am !== 'AM'}
                onClick={this.updateAmPm('AM')}
                className="components-datetime__time-am-button"
              >
                {__('AM')}
              </Button>
              <Button
                isPrimary={state.am === 'PM'}
                isSecondary={state.am !== 'PM'}
                onClick={this.updateAmPm('PM')}
                className="components-datetime__time-pm-button"
              >
                {__('PM')}
              </Button>
            </ButtonGroup>
          )}
        </div>
      </fieldset>*/}
    </div>
  );
}

export default TimePicker;
