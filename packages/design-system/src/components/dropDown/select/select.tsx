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
import { forwardRef } from '@googleforcreators/react';
import type { ComponentPropsWithoutRef, FC, ForwardedRef } from 'react';

/**
 * Internal dependencies
 */
import { Disclosure } from '../../disclosure';
import type { StyleOverride } from '../../../types/theme';
import { SelectButton, Value, LabelText, Label } from './components';

interface DropDownSelectProps extends ComponentPropsWithoutRef<'button'> {
  activeItemLabel?: string;
  activeItemRenderer?: FC;
  dropDownLabel?: string;
  hasError?: boolean;
  isOpen?: boolean;
  onSelectClick?: ComponentPropsWithoutRef<'button'>['onClick'];
  direction?: 'up' | 'down';
  selectValueStylesOverride?: StyleOverride;
  selectButtonStylesOverride?: StyleOverride;
}

const DropDownSelect = forwardRef(
  (
    {
      activeItemLabel,
      activeItemRenderer,
      disabled,
      dropDownLabel,
      hasError,
      isOpen,
      onSelectClick,
      placeholder = '',
      direction = 'down',
      ...rest
    }: DropDownSelectProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const ValueRenderer = activeItemRenderer;
    return (
      <SelectButton
        aria-haspopup
        $isOpen={isOpen}
        disabled={disabled}
        hasError={hasError}
        onClick={onSelectClick}
        ref={ref}
        autoHeight={Boolean(activeItemRenderer)}
        {...rest}
      >
        {ValueRenderer ? (
          <ValueRenderer />
        ) : (
          <Value selectValueStylesOverride={rest.selectValueStylesOverride}>
            {activeItemLabel || placeholder}
          </Value>
        )}

        <Label>
          {dropDownLabel && <LabelText>{dropDownLabel}</LabelText>}

          <Disclosure direction={direction} $isOpen={isOpen} />
        </Label>
      </SelectButton>
    );
  }
);

export default DropDownSelect;
