// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable header/header */
/* Disable reason: This file is based on Gutenberg Datepicker */

/**
 * External dependencies
 */
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import TimePicker from './timePicker';
import DatePicker from './datePicker';

// @todo Adjust this properly.
const DateTimeWrapper = styled.div`
  position: absolute;
  top: 30px;
  left: -250px;
  box-shadow: 0 3px 30px rgba(25, 30, 35, 0.1);
  border: 1px solid #e2e4e7;
  background: #fff;
  z-index: 1;
`;

function DateTimePicker({ value, onChange, is12Hour = true }) {
  return (
    <DateTimeWrapper>
      <TimePicker currentTime={value} onChange={onChange} is12Hour={is12Hour} />
      <DatePicker currentDate={value} onChange={onChange} />
    </DateTimeWrapper>
  );
}

export default DateTimePicker;
