// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable header/header */
/* Disable reason: This file is based on Gutenberg Datepicker */

/**
 * External dependencies
 */
import moment from 'moment';
// Needed to initialise the default datepicker styles.
// See: https://github.com/airbnb/react-dates#initialize
import 'react-dates/initialize';
import { DayPickerSingleDateController } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import { useRef, useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../app';
import { TIMEZONELESS_FORMAT } from '../../../constants';

const CalendarWrapper = styled.div`
  min-height: 236px;
  border-top: 1px solid ${({ theme }) => rgba(theme.colors.bg.v0, 0.2)};
`;

function DatePicker({ currentDate, onChange }) {
  const { isRTL } = useConfig();
  const momentDate = currentDate ? moment(currentDate) : moment();

  const nodeRef = useRef();
  const onChangeMoment = useCallback(
    (newDate) => {
      const momentTime = {
        hours: momentDate.hours(),
        minutes: momentDate.minutes(),
        seconds: 0,
      };
      onChange(
        newDate.set(momentTime).format(TIMEZONELESS_FORMAT),
        /* Close calendar */ true
      );
    },
    [momentDate, onChange]
  );

  /**
   * Note: This comment is copied from Gutenberg.
   *
   * It is kept because focus is lost when we click on the previous and next month buttons.
   * This focus loss closes the date picker popover.
   * Ideally we should add an upstream commit on react-dates to fix this issue.
   */
  const keepFocusInside = () => {
    if (!nodeRef.current) {
      return;
    }
    // If focus was lost.
    if (
      !document.activeElement ||
      !nodeRef.current.contains(document.activeElement)
    ) {
      // Retrieve the focus region div.
      const focusRegion = nodeRef.current.querySelector(
        '.DayPicker_focusRegion'
      );
      if (!focusRegion) {
        return;
      }
      // Keep the focus on focus region.
      focusRegion.focus();
    }
  };

  return (
    <CalendarWrapper ref={nodeRef}>
      <DayPickerSingleDateController
        date={momentDate}
        daySize={30}
        focused
        hideKeyboardShortcutsPanel
        // This is a hack to force the calendar to update on month or year change
        // https://github.com/airbnb/react-dates/issues/240#issuecomment-361776665
        key={`datepicker-controller-${
          momentDate ? momentDate.format('MM-YYYY') : 'null'
        }`}
        noBorder
        numberOfMonths={1}
        onDateChange={onChangeMoment}
        transitionDuration={0}
        weekDayFormat="ddd"
        isRTL={isRTL}
        onPrevMonthClick={keepFocusInside}
        onNextMonthClick={keepFocusInside}
      />
    </CalendarWrapper>
  );
}

DatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  currentDate: PropTypes.string,
};

export default DatePicker;
