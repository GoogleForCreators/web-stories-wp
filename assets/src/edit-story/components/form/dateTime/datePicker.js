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
import { useRef, useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { rgba } from 'polished';

const CalendarWrapper = styled.div`
  min-height: 236px;
  border-top: 1px solid ${({ theme }) => rgba(theme.colors.bg.v0, 0.2)};
`;

function DatePicker({ currentDate, onChange }) {
  const nodeRef = useRef();
  const value = new Date(currentDate);
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
      <Calendar value={value} onChange={handleOnChange} />
    </CalendarWrapper>
  );
}

DatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  currentDate: PropTypes.string,
};

export default DatePicker;
