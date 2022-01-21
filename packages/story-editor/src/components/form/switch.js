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
import { __ } from '@googleforcreators/i18n';
import { useCallback, useRef } from '@googleforcreators/react';
import styled from 'styled-components';
import {
  Switch as BaseSwitch,
  SwitchPropTypes,
  useKeyDownEffect,
} from '@googleforcreators/design-system';

const StyledSwitch = styled(BaseSwitch)`
  label:focus-within ~ span {
    ${({ theme }) =>
      `box-shadow: 0px 0px 0 2px ${theme.colors.bg.secondary}, 0px 0px 0 4px ${theme.colors.border.focus} !important;`};
  }
`;

function Switch({
  offLabel = __('Off', 'web-stories'),
  onChange,
  onLabel = __('On', 'web-stories'),
  value,
  ...props
}) {
  const switchRef = useRef(null);

  const handleToggleValue = useCallback(
    (evt) => {
      onChange(evt, !value);
    },
    [onChange, value]
  );

  useKeyDownEffect(
    switchRef,
    ['space', 'enter', 'left', 'right', 'up', 'down'],
    handleToggleValue,
    [handleToggleValue, value]
  );

  return (
    <StyledSwitch
      ref={switchRef}
      offLabel={offLabel}
      onChange={onChange}
      onLabel={onLabel}
      value={value}
      {...props}
    />
  );
}
Switch.propTypes = SwitchPropTypes;

export default Switch;
