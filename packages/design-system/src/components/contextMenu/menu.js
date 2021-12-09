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
import { BUTTON_TRANSITION_TIMING } from '../button/constants';

const MenuWrapper = styled.div(
  ({ theme }) => css`
    padding: ${({ isIconMenu }) => (isIconMenu ? 0 : '8px 0')};
    background-color: ${theme.colors.bg.primary};
    border-radius: ${theme.borders.radius.small};
    border: 1px solid ${theme.colors.border.disable};
    width: ${({ isIconMenu }) => (isIconMenu ? '40px' : '210px')};
  `
);
MenuWrapper.propTypes = {
  isIconMenu: PropTypes.bool,
};

const separatorCSS = css`
  display: block;
  content: '';
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.divider.primary};
  margin: 8px 0;

  ${({ isIconMenu, theme }) =>
    isIconMenu &&
    css`
      width: 40%;
      margin: auto;
      background-color: ${theme.colors.divider.primary};
    `}
`;
separatorCSS.propTypes = {
  isIconMenu: PropTypes.bool,
};

const MenuList = styled.ul`
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  margin: 0;
  padding: ${({ isIconMenu }) => (isIconMenu ? 0 : '4px 0')};
  pointer-events: auto;
  list-style: none;

  a {
    background-color: transparent;
    text-decoration: none;
  }

  li {
    a,
    button,
    div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2px 16px;
      border: 0;
      color: ${({ theme }) => theme.colors.fg.primary};
      transition: background-color ${BUTTON_TRANSITION_TIMING};
    }
    ${({ isIconMenu }) =>
      isIconMenu &&
      css`
        margin: 0;
        button {
          padding: 0;
          margin: 4px auto;
        }
        div,
        a {
          padding: 0;
        }
      `}

    span {
      transition: color ${BUTTON_TRANSITION_TIMING};
    }

    a {
      :active span,
      :hover span {
        color: ${({ theme }) => theme.colors.fg.primary};
      }
    }

    button {
      width: ${({ isIconMenu }) => (isIconMenu ? '32px' : '100%')};
      border-radius: ${({ isIconMenu }) => (isIconMenu ? '4px' : 0)};
      background-color: transparent;

      :disabled {
        background-color: transparent;

        span {
          color: ${({ theme }) => theme.colors.fg.disable};
        }
      }

      :active span,
      :hover span {
        color: ${({ theme }) => theme.colors.fg.primary};
      }
    }

    &.separatorTop {
      &:before {
        ${separatorCSS};
      }
    }

    &.separatorBottom {
      &:after {
        ${separatorCSS};
      }
    }

    :hover a,
    button:hover:not(:disabled) {
      background-color: ${({ theme }) =>
        theme.colors.interactiveBg.secondaryHover};
    }

    :active a,
    button:active:not(:disabled) {
      background-color: ${({ theme }) =>
        theme.colors.interactiveBg.secondaryPress};
    }
  }
`;
MenuList.propTypes = {
  isIconMenu: PropTypes.bool,
};

const Menu = forwardRef(({ children, isIconMenu, ...props }, ref) => {
  return (
    <MenuWrapper
      data-testid="context-menu-list"
      isIconMenu={isIconMenu}
      role="menu"
      {...props}
    >
      {children}
    </MenuWrapper>
  );
});

export const MenuPropTypes = {
  children: PropTypes.node,
  groupLabel: PropTypes.string,
  isIconMenu: PropTypes.bool,
};

Menu.propTypes = MenuPropTypes;

export default Menu;
