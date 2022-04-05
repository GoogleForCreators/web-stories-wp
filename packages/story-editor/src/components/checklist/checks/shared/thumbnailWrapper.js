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
import styled, { css } from 'styled-components';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  themeHelpers,
} from '@googleforcreators/design-system';
import { useState } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { getVisibleThumbnails } from '../../utils';
import { StyledOverflowThumbnail } from '../../../checklistCard/styles';
import { MAX_THUMBNAILS_DISPLAYED } from '../../../checklistCard/constants';

const Wrapper = styled.div`
  grid-area: thumbnail;
  transition: height ease-in-out 300ms;

  ${({ $isMultiple }) =>
    $isMultiple &&
    css`
      display: grid;
      grid-gap: 8px;
      grid-template-columns: repeat(4, 52px);
      grid-template-rows: auto;
    `}
`;

const StyledButton = styled(Button).attrs({
  variant: BUTTON_VARIANTS.RECTANGLE,
  size: BUTTON_SIZES.SMALL,
  type: BUTTON_TYPES.TERTIARY,
})`
  grid-column: span 4;
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

const ToggleButton = ({ children, isExpanded, ...props }) => (
  <StyledButton aria-pressed={isExpanded} {...props}>
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

const ThumbnailWrapper = ({ children, ...props }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const thumbnailCount = Array.isArray(children) ? children.length : 1;

  // Find out if there is overflow of thumbnails.
  // When there is overflow we are subtracting 1 thumbnail from the available grid space.
  const hasOverflowThumbnail =
    thumbnailCount > 0 && thumbnailCount > MAX_THUMBNAILS_DISPLAYED + 1;

  const visibleThumbnails =
    isExpanded || thumbnailCount <= 1
      ? children
      : getVisibleThumbnails(children);

  const handleExpand = () => setIsExpanded((current) => !current);

  return (
    <Wrapper $isMultiple={thumbnailCount > 1} {...props}>
      {visibleThumbnails}
      {hasOverflowThumbnail && (
        <>
          {!isExpanded && (
            <StyledOverflowThumbnail
              overflowCount={thumbnailCount - MAX_THUMBNAILS_DISPLAYED}
              onClick={handleExpand}
            />
          )}
          <ToggleButton isExpanded={isExpanded} onClick={handleExpand} />
        </>
      )}
    </Wrapper>
  );
};
ThumbnailWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  overflowLabel: PropTypes.string,
  showOverflowThumbnail: PropTypes.bool,
};

export default ThumbnailWrapper;
