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
import type { ComponentPropsWithoutRef } from 'react';

/**
 * Internal dependencies
 */
import { LockOpen, LockClosed } from '../../icons';
import { ButtonType, ButtonVariant, ButtonSize } from './constants';
import { Button } from './button';

interface ToggleProps
  extends Omit<ComponentPropsWithoutRef<typeof Button>, 'type'> {
  type?: ButtonType;
  isToggled?: boolean;
}

function ToggleButton({ isToggled = false, type, ...rest }: ToggleProps) {
  // if type is set to quaternary, use that, otherwise use secondary or tertiary based on state
  const actualType =
    type === ButtonType.Quaternary
      ? type
      : isToggled
      ? ButtonType.Secondary
      : ButtonType.Tertiary;
  return (
    <Button
      {...rest}
      type={actualType}
      aria-pressed={isToggled}
      isToggled={isToggled}
    />
  );
}

interface LockProps extends ComponentPropsWithoutRef<'button'> {
  isLocked?: boolean;
}

function LockToggle({ isLocked = false, ...rest }: LockProps) {
  return (
    <Button
      {...rest}
      aria-pressed={isLocked}
      type={ButtonType.Tertiary}
      size={ButtonSize.Small}
      variant={ButtonVariant.Square}
    >
      {isLocked ? <LockClosed /> : <LockOpen />}
    </Button>
  );
}

export { ToggleButton, LockToggle };
