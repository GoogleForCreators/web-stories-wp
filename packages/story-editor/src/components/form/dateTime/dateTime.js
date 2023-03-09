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
import { useCallback, useRef, useState } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import {
  Button,
  ButtonSize,
  useKeyDownEffect,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import useFocusTrapping from '../../../utils/useFocusTrapping';
import useRovingTabIndex from '../../../utils/useRovingTabIndex';
import TimePicker from './timePicker';
import DatePicker from './datePicker';

const DateTimeWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  border: 1px solid ${({ theme }) => theme.colors.divider.primary};
  width: 100%;
  padding: 4px;
`;

const StyledButton = styled(Button)`
  margin: 5px 0;
  color: ${({ theme }) => theme.colors.interactiveBg.brandNormal};

  &:hover {
    color: ${({ theme }) => theme.colors.interactiveBg.brandHover};
  }
`;

function DateTime({
  value,
  onChange,
  onViewChange,
  is12Hour = true,
  forwardedRef,
  onClose,
  canReset = false,
}) {
  const selectedTime = value ? new Date(value) : new Date();
  const initialHours = selectedTime.getHours();
  const [localeData, setLocaleData] = useState({
    minutes: selectedTime.getMinutes(),
    am: initialHours < 12 ? 'AM' : 'PM',
    hours: is12Hour ? initialHours % 12 || 12 : initialHours,
    date: selectedTime,
  });

  const previousFocus = useRef(document.activeElement);
  const handleClose = useCallback(
    (evt) => {
      if (previousFocus.current) {
        previousFocus.current.focus();
      }
      onClose(evt);
    },
    [onClose]
  );

  useKeyDownEffect(forwardedRef, { key: ['esc'], editable: true }, handleClose);
  useRovingTabIndex({ ref: forwardedRef });
  useFocusTrapping({ ref: forwardedRef });

  return (
    <DateTimeWrapper ref={forwardedRef}>
      <TimePicker
        localeData={localeData}
        setLocaleData={setLocaleData}
        onChange={onChange}
        is12Hour={is12Hour}
      />
      <DatePicker
        currentDate={value}
        onChange={onChange}
        onViewChange={onViewChange}
      />
      {canReset && (
        <StyledButton
          size={ButtonSize.Small}
          onClick={() => {
            onChange(null);
            onClose();
          }}
          aria-label={__('Reset publish time', 'web-stories')}
        >
          {__('Reset', 'web-stories')}
        </StyledButton>
      )}
    </DateTimeWrapper>
  );
}

DateTime.propTypes = {
  onChange: PropTypes.func.isRequired,
  onViewChange: PropTypes.func,
  onClose: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  is12Hour: PropTypes.bool,
  forwardedRef: PropTypes.object,
  canReset: PropTypes.bool,
};

export default DateTime;
