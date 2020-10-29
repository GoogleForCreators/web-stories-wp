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
import PropTypes from 'prop-types';
import styled from 'styled-components';
/**
 * Internal dependencies
 */

import { ChevronLeft } from '../../icons';
import { KEYBOARD_USER_SELECTOR } from '../../constants';

const NavButton = styled.button`
  ${({ theme, rotateRight }) => `
    display: flex;
    align-self: center;
    justify-content: space-around;
    align-items: center;
    contain: content;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    color: ${theme.internalTheme.colors.gray900};
    cursor: pointer;
    background-color: transparent;
    border: ${theme.internalTheme.borders.transparent};
    transition: background-color 300ms ease-in-out, color 300ms ease-in-out;
    padding: 6px;

    &:hover, &:active, &:focus {
      background-color: ${theme.internalTheme.colors.gray800};
      color: ${theme.internalTheme.colors.white};
      
      @media ${theme.internalTheme.breakpoint.largeDisplayPhone} {
        color: ${theme.internalTheme.colors.gray800};
        background-color: transparent;
       }
    }
    ${KEYBOARD_USER_SELECTOR} &:focus {
        border-color: ${theme.internalTheme.colors.action};
      }
    
    &:disabled {
        opacity: 0.3;
        pointer-events: none;
    }
    
    > svg {
      ${rotateRight ? 'right: 2px;' : 'left: 2px;'}
      position: relative;
      transform: ${rotateRight ? 'rotate(180deg)' : 'none'};
      height: 100%;
    }

  `}
`;
NavButton.propTypes = {
  rotateRight: PropTypes.bool,
};

export default function PaginationButton({ rotateRight, ...rest }) {
  return (
    <NavButton {...rest} rotateRight={rotateRight}>
      <ChevronLeft aria-hidden="true" />
    </NavButton>
  );
}

PaginationButton.propTypes = {
  rotateRight: PropTypes.bool,
};
