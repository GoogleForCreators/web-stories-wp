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
import { forwardRef } from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
import {
  Undo as UndoIcon,
  Redo as RedoIcon,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  GridView as GridViewIcon,
  Keyboard as KeyboardIcon,
  Close as CloseIcon,
  Eyedropper as EyedropperIcon,
  More as MoreIcon,
} from '../../icons';

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
  color: ${({ theme }) => theme.colors.fg.v1};

  svg {
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
  }
`;

const StyledButtonWithOpacity = styled(StyledButton)`
  opacity: 0.3;

  &:focus,
  &:active,
  &:hover {
    opacity: 1;
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

export const Plain = styled(Base)`
  color: ${({ theme }) => theme.colors.action};
  border: none;
  transition: background-color 0.6s ease;
  text-transform: uppercase;
  border-radius: 5px;
  padding: 4px 14px;
  height: auto;
  font-weight: 500;
  font-size: 16px;

  &:hover {
    background-color: ${({ theme }) => rgba(theme.colors.action, 0.15)};
  }
`;

export const LeftArrow = (props) => (
  <StyledButtonWithOpacity {...props}>
    <ArrowLeftIcon />
  </StyledButtonWithOpacity>
);

export const RightArrow = (props) => (
  <StyledButtonWithOpacity {...props}>
    <ArrowRightIcon />
  </StyledButtonWithOpacity>
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

export const Keyboard = (props) => (
  <StyledButton {...props}>
    <KeyboardIcon />
  </StyledButton>
);

export const Close = forwardRef((props, ref) => (
  <StyledButton {...props} ref={ref}>
    <CloseIcon />
  </StyledButton>
));

export const Eyedropper = (props) => (
  <StyledButton {...props}>
    <EyedropperIcon />
  </StyledButton>
);

export const More = forwardRef((props, ref) => (
  <StyledButton {...props} ref={ref}>
    <MoreIcon />
  </StyledButton>
));
