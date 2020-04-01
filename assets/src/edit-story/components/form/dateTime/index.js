// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable header/header */
/* Disable reason: This file is based on Gutenberg Datepicker */

/**
 * External dependencies
 */
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { rgba } from 'polished';
import { useRef } from 'react';

/**
 * Internal dependencies
 */
import useFocusOut from '../../../utils/useFocusOut';
import DateTimePicker from './dateTimePicker';
import DatePicker from './datePicker';

const DateTimeWrapper = styled.div`
  box-shadow: 0 3px 30px rgba(25, 30, 35, 0.1);
  border: 1px solid ${({ theme }) => rgba(theme.colors.bg.v0, 0.2)};
  background-color: ${({ theme }) => theme.colors.fg.v1};
`;

function DateTime({ value, onChange, is12Hour = true, onClose }) {
  const containerRef = useRef();
  useFocusOut(containerRef, onClose);
  return (
    <DateTimeWrapper ref={containerRef}>
      <DateTimePicker
        currentTime={value}
        onChange={onChange}
        is12Hour={is12Hour}
      />
      <DatePicker currentDate={value} onChange={onChange} />
    </DateTimeWrapper>
  );
}

DateTime.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  is12Hour: PropTypes.bool,
  onClose: PropTypes.func,
};

export default DateTime;
