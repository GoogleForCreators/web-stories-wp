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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { rgba } from 'polished';
import { useState } from 'react';

/**
 * Internal dependencies
 */
import TimePicker from './timePicker';
import DatePicker from './datePicker';

const DateTimeWrapper = styled.div`
  border-radius: 4px;
  box-shadow: 0 3px 30px rgba(25, 30, 35, 0.1);
  border: 1px solid ${({ theme }) => rgba(theme.colors.bg.v0, 0.2)};
  background-color: ${({ theme }) => theme.colors.fg.v1};
  width: 100%;
  padding: 4px;
`;

function DateTime({
  value,
  onChange,
  onViewChange,
  is12Hour = true,
  forwardedRef,
}) {
  const selectedTime = value ? new Date(value) : new Date();
  const initialHours = selectedTime.getHours();
  const [localData, setLocalData] = useState({
    minutes: selectedTime.getMinutes(),
    am: initialHours < 12 ? 'AM' : 'PM',
    hours: is12Hour ? initialHours % 12 || 12 : initialHours,
    date: selectedTime,
  });
  return (
    <DateTimeWrapper ref={forwardedRef}>
      <TimePicker
        localData={localData}
        setLocalData={setLocalData}
        onChange={onChange}
        is12Hour={is12Hour}
      />
      <DatePicker
        currentDate={value}
        onChange={onChange}
        onViewChange={onViewChange}
      />
    </DateTimeWrapper>
  );
}

DateTime.propTypes = {
  onChange: PropTypes.func.isRequired,
  onViewChange: PropTypes.func,
  value: PropTypes.string,
  is12Hour: PropTypes.bool,
  forwardedRef: PropTypes.object,
};

export default DateTime;
