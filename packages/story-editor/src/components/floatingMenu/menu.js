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
import { forwardRef, useLayoutEffect } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Menu = styled.nav`
  position: absolute;
  background: hotpink;
  padding: 5px;
  border: 1px solid white;
  color: white;
  z-index: 2;
`;

const FloatingMenu = forwardRef(function FloatingMenu(props, ref) {
  useLayoutEffect(() => {
    const node = ref.current;
    const bounds = node.getBoundingClientRect();
    node.style.setProperty('--width', `${bounds.width.toFixed(2)}px`);
    node.style.setProperty('--height', `${bounds.height.toFixed(2)}px`);
  }, [ref]);

  return (
    <Menu ref={ref}>
      {`Floating Menu | Floating Menu | Floating Menu | Floating Menu`}
    </Menu>
  );
});

FloatingMenu.propTypes = {
  isVisible: PropTypes.bool,
};

export default FloatingMenu;
