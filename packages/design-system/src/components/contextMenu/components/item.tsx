/*
 * Copyright 2022 Google LLC
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
import { forwardRef } from '@googleforcreators/react';
import type {
  ComponentPropsWithoutRef,
  ForwardedRef,
  ReactNode,
  VoidFunctionComponent,
} from 'react';

/**
 * Internal dependencies
 */
import Button from './button';
import Shortcut from './shortcut';
import Suffix from './suffix';

const StyledButton = styled(Button)<{ supportsIcon?: boolean }>`
  ${({ supportsIcon }) =>
    supportsIcon &&
    `
    svg {
      width: 32px;
      position: absolute;
      margin-left: -12px;
    }
    span {
      padding-left: 18px;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `}
`;

export interface MenuItemProps
  extends ComponentPropsWithoutRef<typeof StyledButton> {
  label: ReactNode;
  shortcut?: { display: string };
  icon?: ReactNode;
  SuffixIcon?: VoidFunctionComponent;
  className?: string;
}

const MenuItem = forwardRef(function MenuItem(
  {
    label,
    shortcut,
    icon,
    SuffixIcon,
    className,
    ...buttonProps
  }: MenuItemProps,
  ref: ForwardedRef<HTMLButtonElement>
) {
  return (
    <StyledButton className={className} ref={ref} {...buttonProps}>
      {icon}
      {label}
      {shortcut && <Shortcut>{shortcut.display}</Shortcut>}
      {SuffixIcon && (
        <Suffix>
          <SuffixIcon />
        </Suffix>
      )}
    </StyledButton>
  );
});

export default MenuItem;
