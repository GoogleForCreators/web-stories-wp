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
import { useMemo, forwardRef } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import type { ForwardedRef, PropsWithChildren } from 'react';

/**
 * Internal dependencies
 */
import { noop } from '../../utils';
import { SmartPopover, Shadow } from './styled';
import Menu from './menu';
import AnimationContainer from './animationContainer';
import { ContextMenuProvider } from './contextMenuProvider';
import type { ContextMenuProps } from './types';

const ContextMenu = forwardRef(
  (
    {
      animate,
      'aria-label': ariaLabel = __('Menu', 'web-stories'),
      children,
      id,
      isAlwaysVisible,
      isIconMenu = false,
      isHorizontal = false,
      isInline = false,
      onDismiss = noop,
      popoverZIndex,
      ...props
    }: PropsWithChildren<ContextMenuProps>,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const { isRTL } = props;
    const Wrapper = useMemo(
      () => (animate ? AnimationContainer : SmartPopover),
      [animate]
    );

    return (
      <ContextMenuProvider
        isIconMenu={isIconMenu}
        isHorizontal={isHorizontal}
        onDismiss={onDismiss}
      >
        <Wrapper
          aria-label={ariaLabel}
          isInline={isInline}
          role={isAlwaysVisible ? null : 'dialog'}
          isOpen={isAlwaysVisible || props.isOpen}
          isRTL={isRTL}
          popoverZIndex={popoverZIndex}
        >
          <Menu
            aria-label={ariaLabel}
            ref={ref}
            aria-expanded={props.isOpen}
            {...props}
          >
            {children}
          </Menu>
          {/* <AnimationContainer /> has a <Shadow />. Don't double the shadow. */}
          {!animate && <Shadow $isHorizontal={isHorizontal} />}
        </Wrapper>
      </ContextMenuProvider>
    );
  }
);

export default ContextMenu;
