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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
import { TypographyPresets } from '../typography';
import { KEYBOARD_USER_SELECTOR } from '../../constants';

export const SearchContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  border-radius: ${({ theme }) =>
    `${theme.DEPRECATED_THEME.expandedTypeahead.borderRadius}px`};
  border: none;
  background: none;

  @media ${({ theme }) => theme.DEPRECATED_THEME.breakpoint.largeDisplayPhone} {
    flex: ${({ isExpanded }) => (isExpanded ? '1 0 100%' : '0 1 40px')};
    transition: flex 0.2s cubic-bezier(0.39, 0.575, 0.565, 1);
  }
`;
SearchContainer.propTypes = {
  isExpanded: PropTypes.bool,
  isOpen: PropTypes.bool,
};

export const InputContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  padding: 5px 8px;
  border-radius: ${({ theme }) =>
    `${theme.DEPRECATED_THEME.typeahead.borderRadius}px`};
  border: 1px solid ${({ theme }) => theme.DEPRECATED_THEME.colors.gray50};
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.gray500};
  background-color: ${({ theme }) => theme.DEPRECATED_THEME.colors.gray25};
`;

export const ControlVisibilityContainer = styled.div`
  position: relative;
  display: flex;
  flex-grow: 1;

  @media ${({ theme }) => theme.DEPRECATED_THEME.breakpoint.largeDisplayPhone} {
    opacity: ${({ isExpanded }) => (isExpanded ? '1' : '0')};
    transition: opacity 0.2s cubic-bezier(0.39, 0.575, 0.565, 1);
  }
`;
ControlVisibilityContainer.propTypes = {
  isExpanded: PropTypes.bool,
};

export const StyledInput = styled.input`
  ${TypographyPresets.Small};
  position: relative;
  height: 100%;
  width: 100%;
  padding: 0 0 0 7.5px;
  font-weight: ${({ theme }) => theme.DEPRECATED_THEME.typography.weight.bold};
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.gray900};
  background-color: transparent;
  border: none;

  &:disabled {
    cursor: default;
  }

  ${KEYBOARD_USER_SELECTOR} &:focus {
    outline: ${({ theme }) =>
      `2px solid ${rgba(
        theme.DEPRECATED_THEME.colors.bluePrimary,
        0.85
      )} !important`};
  }

  @media ${({ theme }) => theme.DEPRECATED_THEME.breakpoint.largeDisplayPhone} {
    width: ${({ isExpanded }) => (isExpanded ? '100%' : '0')};
  }
`;
StyledInput.propTypes = {
  isExpanded: PropTypes.bool,
};

export const SearchButton = styled.button`
  margin: 0;
  padding: 0;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.gray300};
  height: 16px;
  & > svg {
    height: 100%;
  }

  @media ${({ theme }) => theme.DEPRECATED_THEME.breakpoint.largeDisplayPhone} {
    color: ${({ theme }) => theme.DEPRECATED_THEME.colors.gray500};
  }
`;

export const ClearInputButton = styled.button`
  border: none;
  background-color: transparent;
  margin: auto 0;
  padding: 0;
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.gray600};
  cursor: pointer;
  height: 12px;

  & > svg {
    height: 100%;
  }

  ${KEYBOARD_USER_SELECTOR} &:focus {
    outline: ${({ theme }) =>
      `2px solid ${rgba(
        theme.DEPRECATED_THEME.colors.bluePrimary,
        0.85
      )} !important`};
  }
`;
