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
import PropTypes from 'prop-types';

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
  height: 30px;
  padding: 0 10px;
  cursor: pointer;
  text-decoration: none;
  font-family: ${({ theme }) => theme.fonts.body2.family};
  font-size: ${({ theme }) => theme.fonts.body2.size};
  line-height: 28px;

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

const PrimaryButton = styled(Base)`
  border-color: ${({ theme }) => theme.colors.action};
  background-color: ${({ theme }) => theme.colors.action};
  color: ${({ theme }) => theme.colors.fg.v1};
`;

const SecondaryButton = styled(Base)`
  border-color: ${({ theme }) => theme.colors.fg.v1};
  background-color: ${({ theme }) => theme.colors.fg.v3};
  color: ${({ theme }) => theme.colors.bg.v5};
`;

const OutlineButton = styled(Base)`
  border-color: ${({ theme }) => theme.colors.fg.v4};
  color: ${({ theme }) => theme.colors.fg.v1};
`;

const PlainButton = styled(Base)`
  color: ${({ theme }) => theme.colors.action};
  border: none;
  transition: background-color 0.6s ease;
  text-transform: uppercase;
  border-radius: 5px;
  padding: 4px 14px;
  height: auto;
  font-weight: 500;
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-size: ${({ theme }) => theme.fonts.body1.size};
  line-height: ${({ theme }) => theme.fonts.body1.lineHeight};

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

export const BUTTON_TYPES = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  OUTLINE: 'outline',
  PLAIN: 'plain',
};

export const Primary = ({ children, ...rest }) => {
  return (
    <Button type={BUTTON_TYPES.PRIMARY} {...rest}>
      {children}
    </Button>
  );
};

Primary.propTypes = {
  children: PropTypes.node.isRequired,
};

export const Secondary = ({ children, ...rest }) => {
  return (
    <Button type={BUTTON_TYPES.SECONDARY} {...rest}>
      {children}
    </Button>
  );
};

Secondary.propTypes = {
  children: PropTypes.node.isRequired,
};

export const Outline = ({ children, ...rest }) => {
  return (
    <Button type={BUTTON_TYPES.OUTLINE} {...rest}>
      {children}
    </Button>
  );
};

Outline.propTypes = {
  children: PropTypes.node.isRequired,
};

export const Plain = ({ children, ...rest }) => {
  return (
    <Button type={BUTTON_TYPES.PLAIN} {...rest}>
      {children}
    </Button>
  );
};

Plain.propTypes = {
  children: PropTypes.node.isRequired,
};

const Button = ({ children, type = BUTTON_TYPES.PRIMARY, ...rest }) => {
  const ButtonOptions = {
    [BUTTON_TYPES.PRIMARY]: PrimaryButton,
    [BUTTON_TYPES.SECONDARY]: SecondaryButton,
    [BUTTON_TYPES.OUTLINE]: OutlineButton,
    [BUTTON_TYPES.PLAIN]: PlainButton,
  };

  const isLink = rest.href !== undefined;

  const StyledButtonByType = ButtonOptions[type];

  return (
    <StyledButtonByType as={isLink ? 'a' : 'button'} {...rest}>
      {children}
    </StyledButtonByType>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(Object.values(BUTTON_TYPES)),
  children: PropTypes.node.isRequired,
};
