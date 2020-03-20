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
