/*
 * Copyright 2021 Google LLC
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
import { v4 as uuidv4 } from 'uuid';
import { useMemo, forwardRef } from '@googleforcreators/react';
import type {
  ComponentPropsWithoutRef,
  FocusEvent,
  ForwardedRef,
  MouseEvent,
  SyntheticEvent,
} from 'react';

/**
 * Internal dependencies
 */
import { Button as BaseButton } from '../../button';
import { useContextMenu } from '../contextMenuProvider';
import { menuItemStyles } from './styles';

const StyledButton = styled(BaseButton)<{
  isHorizontal?: boolean;
  isIconMenu?: boolean;
  forcePadding?: boolean;
}>`
  ${menuItemStyles};

  width: auto;

  ${({ isHorizontal, isIconMenu, forcePadding, theme }) => {
    const hasHeight = isHorizontal; // In a horizontal menu, all buttons are 32px high
    const hasNoPadding = !forcePadding && (isHorizontal || isIconMenu);
    const hasBorderRadius = isHorizontal || isIconMenu;
    return {
      height: hasHeight ? '32px' : undefined,
      padding: hasNoPadding ? 0 : undefined,
      borderRadius: hasBorderRadius ? theme.borders.radius.small : 0,
    };
  }}

  :disabled {
    background-color: transparent;

    span {
      color: ${({ theme }) => theme.colors.fg.disable};
    }
  }

  :hover:not(:disabled) {
    background-color: ${({ theme }) =>
      theme.colors.interactiveBg.secondaryHover};
  }

  :active:not(:disabled) {
    background-color: ${({ theme }) =>
      theme.colors.interactiveBg.secondaryPress};
  }
`;

export interface MenuButtonProps
  extends ComponentPropsWithoutRef<typeof StyledButton> {
  id?: string;
  onClick: (evt: SyntheticEvent<HTMLButtonElement>) => void;
  onBlur?: (evt: SyntheticEvent<HTMLButtonElement>) => void;
  onFocus?: (evt: SyntheticEvent<HTMLButtonElement>) => void;
  forcePadding?: boolean;
  dismissOnClick?: boolean;
}

/**
 * A styled button for use in the context menu.
 */
const Button = forwardRef(function Button(
  {
    id,
    onBlur,
    onClick,
    onFocus,
    forcePadding = false,
    dismissOnClick = true,
    ...props
  }: MenuButtonProps,
  ref: ForwardedRef<HTMLButtonElement>
) {
  const {
    focusedId,
    isIconMenu,
    isHorizontal,
    onDismiss,
    onMenuItemBlur,
    onMenuItemFocus,
  } = useContextMenu(({ state, actions }) => ({
    focusedId: state.focusedId,
    isIconMenu: state.isIconMenu,
    isHorizontal: state.isHorizontal,
    onDismiss: actions.onDismiss,
    onMenuItemBlur: actions.onMenuItemBlur,
    onMenuItemFocus: actions.onMenuItemFocus,
  }));
  const autoGeneratedId = useMemo(uuidv4, []);
  const elementId = id || autoGeneratedId;

  const handleBlur = (evt: FocusEvent<HTMLButtonElement>) => {
    onMenuItemBlur();
    onBlur?.(evt);
  };

  const handleClick = (evt: MouseEvent<HTMLButtonElement>) => {
    onClick(evt);
    if (dismissOnClick) {
      onDismiss(evt.nativeEvent);
    }
  };

  const handleFocus = (evt: FocusEvent<HTMLButtonElement>) => {
    onMenuItemFocus(elementId);
    onFocus?.(evt);
  };

  return (
    <StyledButton
      ref={ref}
      id={elementId}
      tabIndex={focusedId === elementId ? 0 : -1}
      role="menuitem"
      isIconMenu={isIconMenu}
      isHorizontal={isHorizontal}
      forcePadding={forcePadding}
      onBlur={handleBlur}
      onClick={handleClick}
      onFocus={handleFocus}
      {...props}
    />
  );
});

export default Button;
