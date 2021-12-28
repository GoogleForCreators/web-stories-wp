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
import { useState } from '@web-stories-wp/react';

/**
 * Internal dependencies
 */
import { getVisibleThumbnails } from '../checklist/utils';
import ToggleButton from './toggleButton';
import { StyledOverflowThumbnail } from './styles';
import { DEFAULT_OVERFLOW_LABEL, MAX_THUMBNAILS_DISPLAYED } from '.';

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

      display: grid;
      grid-gap: 8px;
      grid-template-columns: repeat(4, 52px);
      grid-template-rows: auto;
    `}
`;

const ThumbnailWrapper = ({
  children,
  overflowLabel = DEFAULT_OVERFLOW_LABEL,
  thumbnails = [],
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const thumbnailCount = thumbnails.length;

  // Find out if there is overflow of thumbnails.
  // When there is overflow we are subtracting 1 thumbnail from the available grid space.
  const hasOverflowThumbnail =
    thumbnailCount > 0 && thumbnailCount > MAX_THUMBNAILS_DISPLAYED + 1;

  const visibleThumbnails = isExpanded
    ? thumbnails
    : getVisibleThumbnails(thumbnails);

  const handleExpand = () => setIsExpanded((current) => !current);

  return (
    <Wrapper $isMultiple={thumbnails.length > 1} {...props}>
      {visibleThumbnails}
      {hasOverflowThumbnail && (
        <>
          {!isExpanded && (
            <StyledOverflowThumbnail
              screenReaderText={overflowLabel}
              overflowCount={thumbnailCount - MAX_THUMBNAILS_DISPLAYED}
              onClick={handleExpand}
            />
          )}
          <ToggleButton isExpanded={isExpanded} onClick={handleExpand} />
        </>
      )}
      {children}
    </Wrapper>
  );
};
ThumbnailWrapper.propTypes = {
  children: PropTypes.node,
  overflowLabel: PropTypes.string,
  showOverflowThumbnail: PropTypes.bool,
  thumbnails: PropTypes.arrayOf(PropTypes.node),
};

export default ThumbnailWrapper;
