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

/**
 * Internal dependencies
 */
import UndoIcon from './icons/undo.svg';
import RedoIcon from './icons/redo.svg';
import LeftArrowIcon from './icons/arrow_left.svg';
import RightArrowIcon from './icons/arrow_right.svg';
import GridViewIcon from './icons/grid_view.svg';

const Base = styled.button.attrs(({ isDisabled }) => ({
  disabled: isDisabled,
}))`
  border-width: 1px;
  border-style: solid;
  border-radius: 2px;
  background: transparent;
  display: block;
  min-width: ${({ isIcon }) => (isIcon ? 'initial' : '63px')};
  line-height: 28px;
  height: 30px;
  padding: 0 10px;
  cursor: pointer;
  font-size: 14px;

  &:active {
    outline: none;
  }

  svg {
    width: 1em;
  }

  ${({ disabled }) =>
    disabled &&
    `
		pointer-events: none;
		opacity: .3;
	`}
`;

const StyledButton = styled(Base)`
  border: none;
  padding: 0;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  min-width: initial;
  visibility: ${({ isHidden }) => (isHidden ? 'hidden' : 'visible')};
  opacity: 0.3;
  color: ${({ theme }) => theme.colors.fg.v1};

  &:focus,
  &:active,
  &:hover {
    opacity: 1;
  }

  svg {
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
  }
`;

export const Primary = styled(Base)`
  border-color: ${({ theme }) => theme.colors.action};
  background-color: ${({ theme }) => theme.colors.action};
  color: ${({ theme }) => theme.colors.fg.v1};
`;

export const Secondary = styled(Base)`
  border-color: ${({ theme }) => theme.colors.fg.v1};
  background-color: ${({ theme }) => theme.colors.fg.v3};
  color: ${({ theme }) => theme.colors.bg.v5};
`;

export const Outline = styled(Base)`
  border-color: ${({ theme }) => theme.colors.fg.v4};
  color: ${({ theme }) => theme.colors.fg.v1};
`;

export const LeftArrow = (props) => (
  <StyledButton {...props}>
    <LeftArrowIcon />
  </StyledButton>
);

export const RightArrow = (props) => (
  <StyledButton {...props}>
    <RightArrowIcon />
  </StyledButton>
);

export const Undo = (props) => (
  <Outline isIcon {...props}>
    <UndoIcon />
  </Outline>
);

export const Redo = (props) => (
  <Outline isIcon {...props}>
    <RedoIcon />
  </Outline>
);

export const GridView = (props) => (
  <StyledButton {...props}>
    <GridViewIcon />
  </StyledButton>
);

export const ActionButton = styled.button.attrs({ type: 'button' })`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.fg.v3};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.bg.v5};
  font-size: 15px;
  line-height: 30px;
  padding: 0 15px;
`;
