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
import {
  useRef,
  useCallback,
  useMemo,
  useEffect,
  lazy,
  Suspense,
} from '@googleforcreators/react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { _x } from '@googleforcreators/i18n';
import { getOptions } from '@googleforcreators/date';
import { CircularProgress } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import CalendarWrapper from './calendarWrapper';
import { getCalenderType } from './utils';

const Calendar = lazy(() =>
  import(/* webpackChunkName: "chunk-react-calendar" */ 'react-calendar')
);

const FallbackCalendar = styled.div`
  height: 256px;
  width: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function DatePicker({ currentDate, onChange, onViewChange }) {
  const nodeRef = useRef();
  const value = useMemo(() => new Date(currentDate), [currentDate]);
  const handleOnChange = useCallback(
    (newDate) => {
      newDate.setHours(value.getHours());
      newDate.setMinutes(value.getMinutes());
      onChange(newDate.toISOString(), /* Close calendar */ true);
    },
    [value, onChange]
  );

  const updateTabIndexes = useCallback(
    (setFocus = false) => {
      // Set tabIndex to -1 for every except for the first button.
      if (nodeRef.current) {
        // Allow tabbing to sections inside the calendar.
        const navButtons = [
          ...nodeRef.current.querySelectorAll(
            '.react-calendar__navigation button'
          ),
        ];
        navButtons[0].tabIndex = '0';
        navButtons.shift();
        for (const btn of navButtons) {
          btn.tabIndex = '-1';
        }

        // Dates / days.
        const buttons = [
          ...nodeRef.current.querySelectorAll(
            '.react-calendar__viewContainer button'
          ),
        ];

        let foundActive = false;
        for (const btn of buttons) {
          if (!btn.classList.contains('react-calendar__tile--now')) {
            btn.tabIndex = '-1';
          } else {
            btn.tabIndex = '0';
            if (setFocus) {
              // When changing view we need to explicitly set focus again,
              // It seems to not be happening by default.
              btn.focus();
            }
            foundActive = true;
          }
        }
        if (!foundActive) {
          // Assume first as active.
          buttons[0].tabIndex = '0';
          buttons[0].focus();
        }
      }
    },
    [nodeRef]
  );

  useEffect(() => {
    // Wait one tick for the calendar to be available.
    const timeout = setTimeout(() => {
      updateTabIndexes();
    });
    return () => {
      clearTimeout(timeout);
    };
  }, [updateTabIndexes]);
  const { weekStartsOn } = getOptions();
  const calendarType = getCalenderType(weekStartsOn);
  return (
    <Suspense
      fallback={
        <FallbackCalendar>
          <CircularProgress />
        </FallbackCalendar>
      }
    >
      <CalendarWrapper ref={nodeRef}>
        <Calendar
          value={value}
          calendarType={calendarType}
          onChange={handleOnChange}
          onViewChange={onViewChange}
          onActiveStartDateChange={() => updateTabIndexes(true /* Set focus */)}
          nextAriaLabel={_x(
            'Next',
            'This label can apply to next month, year and/or decade',
            'web-stories'
          )}
          prevAriaLabel={_x(
            'Previous',
            'This label can apply to previous month, year and/or decade',
            'web-stories'
          )}
          next2AriaLabel={_x(
            'Jump forward',
            'This label can apply to month, year and/or decade',
            'web-stories'
          )}
          prev2AriaLabel={_x(
            'Jump backwards',
            'This label can apply to month, year and/or decade',
            'web-stories'
          )}
        />
      </CalendarWrapper>
    </Suspense>
  );
}

DatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  onViewChange: PropTypes.func,
  currentDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default DatePicker;
