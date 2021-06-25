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
import { LockOpen, LockClosed } from '../../icons';
import { BUTTON_TYPES, BUTTON_SIZES, BUTTON_VARIANTS } from './constants';
import { Button } from './button';

function ToggleButton({ isToggled = false, ...rest }) {
  return (
    <Button
      {...rest}
      type={isToggled ? BUTTON_TYPES.SECONDARY : BUTTON_TYPES.TERTIARY}
      aria-pressed={isToggled}
    />
  );
}

ToggleButton.propTypes = {
  isToggled: PropTypes.bool,
};

function LockToggle({ isLocked = false, ...rest }) {
  return (
    <Button
      {...rest}
      aria-pressed={isLocked}
      type={BUTTON_TYPES.TERTIARY}
      size={BUTTON_SIZES.SMALL}
      variant={BUTTON_VARIANTS.SQUARE}
    >
      {isLocked ? <LockClosed /> : <LockOpen />}
    </Button>
  );
}

LockToggle.propTypes = {
  isLocked: PropTypes.bool,
};
export { ToggleButton, LockToggle };
