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

/**
 * Internal dependencies
 */
import { TypographyPresets } from '../../typography';

export const SearchContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  border-radius: ${({ theme }) => `${theme.expandedTypeahead.borderRadius}px`};
  border: none;
  background: none;

  @media ${({ theme }) => theme.breakpoint.largeDisplayPhone} {
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
  border-radius: ${({ theme }) => `${theme.typeahead.borderRadius}px`};
  border: 1px solid ${({ theme }) => theme.colors.gray50};
  color: ${({ theme }) => theme.colors.gray500};
  background-color: ${({ theme }) => theme.colors.gray25};
`;

export const ControlVisibilityContainer = styled.div`
  position: relative;
  display: flex;
  flex-grow: 1;

  @media ${({ theme }) => theme.breakpoint.largeDisplayPhone} {
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
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.colors.gray900};
  background-color: transparent;
  border: none;

  &:disabled {
    cursor: default;
  }

  @media ${({ theme }) => theme.breakpoint.largeDisplayPhone} {
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
  color: ${({ theme }) => theme.colors.gray300};
  height: 16px;
  & > svg {
    height: 100%;
  }

  @media ${({ theme }) => theme.breakpoint.largeDisplayPhone} {
    color: ${({ theme }) => theme.colors.gray500};
  }
`;

export const ClearInputButton = styled.button`
  border: none;
  background-color: transparent;
  margin: auto 0;
  padding: 0;
  color: ${({ theme }) => theme.colors.gray600};
  cursor: pointer;
  height: 12px;

  & > svg {
    height: 100%;
  }
`;
