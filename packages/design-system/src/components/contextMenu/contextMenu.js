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
import PropTypes from 'prop-types';
import { useMemo } from '@web-stories-wp/react';
/**
 * Internal dependencies
 */
import { SmartPopover, Shadow } from './styled';
import Menu, { MenuPropTypes } from './menu';
import AnimationContainer from './animationContainer';
import { ContextMenuProvider } from './provider';

const ContextMenu = ({
  animate,
  children,
  isAlwaysVisible,
  isRTL,
  isIconMenu,
  isInline = false,
  ...props
}) => {
  const Wrapper = useMemo(
    () => (animate ? AnimationContainer : SmartPopover),
    [animate]
  );

  return (
    <ContextMenuProvider isIconMenu={isIconMenu}>
      <Wrapper
        isInline={isInline}
        role={isAlwaysVisible ? null : 'dialog'}
        isOpen={isAlwaysVisible || props.isOpen}
        isRTL={isRTL}
      >
        <Menu aria-expanded={props.isOpen} {...props}>
          {children}
        </Menu>
        {/* <AnimationContainer /> has a <Shadow />. Don't double the shadow. */}
        {!animate && <Shadow />}
      </Wrapper>
    </ContextMenuProvider>
  );
};
ContextMenu.propTypes = {
  ...MenuPropTypes,
  animate: PropTypes.bool,
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  onDismiss: PropTypes.func,
  isAlwaysVisible: PropTypes.bool,
  isRTL: PropTypes.bool,
};

export default ContextMenu;
