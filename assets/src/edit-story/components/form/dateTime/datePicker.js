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
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useRef, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const CalendarWrapper = styled.div`
  min-height: 236px;
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

  return (
    <CalendarWrapper ref={nodeRef}>
      <Calendar
        value={value}
        onChange={handleOnChange}
        onViewChange={onViewChange}
      />
    </CalendarWrapper>
  );
}

DatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  onViewChange: PropTypes.func,
  currentDate: PropTypes.string,
};

export default DatePicker;
