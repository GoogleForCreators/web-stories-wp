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
import { useMemo } from 'react';

/**
 * Internal dependencies
 */
import { Popover, Shadow } from './styled';
import Menu, { MenuPropTypes } from './menu';
import Mask from './mask';
import AnimationContainer from './animationContainer';

const ContextMenu = ({ animate, isAlwaysVisible, items, ...props }) => {
  const Wrapper = useMemo(
    () => (animate ? AnimationContainer : Popover),
    [animate]
  );

  return (
    <>
      {!isAlwaysVisible && props.isOpen && <Mask onDismiss={props.onDismiss} />}
      <Wrapper
        role={isAlwaysVisible ? '' : 'dialog'}
        isOpen={isAlwaysVisible || props.isOpen}
      >
        <Menu aria-expanded={props.isOpen} items={items} {...props} />
        <Shadow />
      </Wrapper>
    </>
  );
};
ContextMenu.propTypes = {
  ...MenuPropTypes,
  animate: PropTypes.bool,
  isOpen: PropTypes.bool,
  isAlwaysVisible: PropTypes.bool,
};

export default ContextMenu;
