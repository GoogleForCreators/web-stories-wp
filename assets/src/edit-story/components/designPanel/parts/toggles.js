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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { Lock, Unlock } from '../../../icons';
import Toggle from '../../form/toggle';
import ToggleButton from '../../form/toggleButton';
import useSetupFor from '../useSetupFor';

export function IconToggle({ property, ...rest }) {
  const { value } = useSetupFor(property);
  return <Toggle value={value} {...rest} />;
}

IconToggle.propTypes = {
  property: PropTypes.string.isRequired,
};

export function LockToggle({ ...rest }) {
  return <IconToggle icon={<Lock />} uncheckedIcon={<Unlock />} {...rest} />;
}

export function StateToggle({ property, value = true, ...rest }) {
  const { value: currentValue } = useSetupFor(property);
  return <ToggleButton value={value === currentValue} {...rest} />;
}

StateToggle.propTypes = {
  property: PropTypes.string.isRequired,
  value: PropTypes.string,
};
