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
import { __ } from '@web-stories-wp/i18n';
import { useCallback, useRef } from 'react';

/**
 * Internal dependencies
 */
import {
  Switch as BaseSwitch,
  SwitchPropTypes,
  useKeyDownEffect,
} from '../../../design-system';

function Switch({ onChange, value, ...props }) {
  const switchRef = useRef(null);

  const handleToggleValue = useCallback(
    (evt) => {
      onChange(evt, !value);
    },
    [onChange, value]
  );

  useKeyDownEffect(switchRef, ['space', 'enter'], handleToggleValue, [
    handleToggleValue,
    value,
  ]);

  return (
    <BaseSwitch ref={switchRef} onChange={onChange} value={value} {...props} />
  );
}
Switch.propTypes = SwitchPropTypes;
Switch.defaultProps = {
  offLabel: __('Off', 'web-stories'),
  onLabel: __('On', 'web-stories'),
};

export default Switch;
