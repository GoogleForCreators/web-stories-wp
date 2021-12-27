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
import {
  Button,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  BUTTON_SIZES,
  Icons,
  themeHelpers,
} from '@web-stories-wp/design-system';
import { __ } from '@web-stories-wp/i18n';
import { useState } from '@web-stories-wp/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledButton = styled(Button).attrs({
  variant: BUTTON_VARIANTS.RECTANGLE,
  size: BUTTON_SIZES.SMALL,
  type: BUTTON_TYPES.TERTIARY,
})`
  grid-area: button;
  justify-content: center;
  height: 32px;
  width: 100%;
  margin: 4px 0;

  ${({ theme }) =>
    themeHelpers.focusableOutlineCSS(
      theme.colors.border.focus,
      theme.colors.bg.tertiary
    )};
`;

const IconContainer = styled.div`
  height: 18px;
  width: 20px;

  svg {
    transform: ${({ $isExpanded }) => $isExpanded && 'rotate(-180deg)'};
    transition: transform ease-in-out 300ms;
  }
`;

/**
 * Small hook that generates an event handler and the state for the toggle button
 *
 * @param {boolean} initialExpandedState Initial expanded state..
 * @return {{ isExpanded: boolean, onExpand: Function }} The state and click event handler.
 */
export const useToggleButton = (initialExpandedState = false) => {
  const [isExpanded, setIsExpanded] = useState(initialExpandedState);

  const handleExpand = () => setIsExpanded((current) => !current);

  return { isExpanded, onExpand: handleExpand };
};

const ToggleButton = ({ children, isExpanded, ...props }) => (
  <StyledButton {...props}>
    {children || isExpanded
      ? __('Collapse', 'web-stories')
      : __('Expand', 'web-stories')}
    <IconContainer $isExpanded={isExpanded}>
      <Icons.ChevronDown />
    </IconContainer>
  </StyledButton>
);
ToggleButton.propTypes = {
  children: PropTypes.node,
  isExpanded: PropTypes.bool,
};

export default ToggleButton;
