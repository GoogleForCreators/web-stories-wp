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
import styled, { css } from 'styled-components';
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
import { COMPACT_THUMB_WIDTH, COMPACT_THUMB_HEIGHT } from '../layout';

<<<<<<< HEAD
function CompactIndicatorWithRef(
  { onClick, isActive, ariaLabel, role, tabIndex },
  ref
) {
  return (
    <Indicator
      onClick={onClick}
      isActive={isActive}
      aria-label={ariaLabel}
      role={role}
      ref={ref}
      tabIndex={tabIndex}
    />
  );
}

const Indicator = styled.button`
=======
const CompactIndicator = styled.button`
>>>>>>> clean up
  display: block;
  width: ${COMPACT_THUMB_WIDTH}px;
  height: ${COMPACT_THUMB_HEIGHT}px;
  border: 0;
  outline: 0;
  cursor: ${({ isInteractive }) => (isInteractive ? 'pointer' : 'default')};
  border-radius: 6px;
  background: ${({ isActive, theme }) =>
    isActive ? theme.colors.selection : 'rgba(255, 255, 255, 0.28)'};

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.accent.primary};
  }

  ${({ isActive, isInteractive, theme }) =>
    !isActive &&
    isInteractive &&
    css`
      &:hover,
      &:focus {
        background: ${rgba(theme.colors.selection, 0.3)};
      }
    `}
`;

<<<<<<< HEAD
const CompactIndicator = forwardRef(CompactIndicatorWithRef);

CompactIndicator.propTypes = {
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
  ariaLabel: PropTypes.string.isRequired,
  tabIndex: PropTypes.number,
  role: PropTypes.string,
};

CompactIndicatorWithRef.propTypes = CompactIndicator.propTypes;

=======
>>>>>>> clean up
export default CompactIndicator;
