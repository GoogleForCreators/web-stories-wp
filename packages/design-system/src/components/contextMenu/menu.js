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
import { forwardRef } from '@web-stories-wp/react';
import styled, { css } from 'styled-components';
/**
 * Internal dependencies
 */
import { useContextMenu } from './provider';

const MenuWrapper = styled.div(
  ({ theme }) => css`
    padding: ${({ $isIconMenu }) => ($isIconMenu ? '4px 3px' : '8px 0')};
    background-color: ${theme.colors.bg.primary};
    border-radius: ${theme.borders.radius.small};
    border: 1px solid ${theme.colors.border.disable};
    width: ${({ $isIconMenu }) => ($isIconMenu ? 40 : 210)}px;
  `
);
MenuWrapper.propTypes = {
  isIconMenu: PropTypes.bool,
};

const Menu = forwardRef(({ children, ...props }, ref) => {
  const isIconMenu = useContextMenu(({ state }) => state.isIconMenu);

  return (
    <MenuWrapper
      data-testid="context-menu-list"
      role="menu"
      $isIconMenu={isIconMenu}
      {...props}
    >
      {children}
    </MenuWrapper>
  );
});

export const MenuPropTypes = {
  children: PropTypes.node,
  groupLabel: PropTypes.string,
};

Menu.propTypes = MenuPropTypes;

export default Menu;
