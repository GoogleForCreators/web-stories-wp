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
import { default as Calendar } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useRef, useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
import getLocalDateTime from '../../../utils/getLocalDateTime';

const CalendarWrapper = styled.div`
  min-height: 236px;
  border-top: 1px solid ${({ theme }) => rgba(theme.colors.bg.v0, 0.2)};
`;

function DatePicker({ currentDate, onChange }) {
  const nodeRef = useRef();
  const handleOnChange = useCallback(
    (newDate) => {
      onChange(getLocalDateTime(newDate), /* Close calendar */ true);
    },
    [onChange]
  );

  return (
    <CalendarWrapper ref={nodeRef}>
      <Calendar
        selected={Date.parse(currentDate)}
        onChange={handleOnChange}
        inline
        showYearDropdown
      />
    </CalendarWrapper>
  );
}

DatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  currentDate: PropTypes.string,
};

export default DatePicker;
