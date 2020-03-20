// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable header/header */
/* Disable reason: This file is based on Gutenberg Datepicker */

/**
 * External dependencies
 */
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
import TimePicker from './timePicker';
import DatePicker from './datePicker';

const DateTimeWrapper = styled.div`
  position: absolute;
  top: 30px;
  left: -255px;
  box-shadow: 0 3px 30px rgba(25, 30, 35, 0.1);
  border: 1px solid ${({ theme }) => rgba(theme.colors.bg.v0, 0.2)};
  background-color: ${({ theme }) => theme.colors.fg.v1};
  z-index: 1;
  width: 270px;
  padding: 4px;
`;

function DateTimePicker({ value, onChange, is12Hour = true, forwardedRef }) {
  return (
    <DateTimeWrapper ref={forwardedRef}>
      <TimePicker currentTime={value} onChange={onChange} is12Hour={is12Hour} />
      <DatePicker currentDate={value} onChange={onChange} />
    </DateTimeWrapper>
  );
}

DateTimePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  is12Hour: PropTypes.bool,
  forwardedRef: PropTypes.func,
};

export default DateTimePicker;
