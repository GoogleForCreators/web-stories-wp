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
import PropTypes from 'prop-types'; // import styled from 'styled-components';
import styled from 'styled-components';

/**
 * Internal dependencies
 */

import { KEYBOARD_USER_SELECTOR, CHIP_TYPES } from '../../constants';
import { ReactComponent as BookmarkFill } from '../../icons/bookmark-fill.svg';
import { ReactComponent as BookmarkOutline } from '../../icons/bookmark-outline.svg';

const chipSize = {
  [CHIP_TYPES.STANDARD]: {
    container: '40px',
    icon: {
      height: '18px',
      width: '14px',
    },
  },
  [CHIP_TYPES.SMALL]: {
    container: '32px',
    icon: {
      height: '14px',
      width: '10px',
    },
  },
};

const ChipContainer = styled.button`
  box-shadow: ${({ theme }) => theme.chip.shadow};
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray500};
  border-radius: ${({ theme }) => theme.border.buttonRadius};
  border: 1px solid transparent;
  height: ${({ chipType }) => chipSize[chipType].container};
  width: ${({ chipType }) => chipSize[chipType].container};
  cursor: pointer;
  display: flex;
  align-items: center;

  &:focus,
  &:active,
  &:hover {
    color: ${({ theme }) => theme.colors.gray600};
  }

  ${KEYBOARD_USER_SELECTOR} &:focus {
    border-color: ${({ theme }) => theme.colors.action};
  }

  &:disabled {
    opacity: 0.5;
    color: ${({ theme }) => theme.colors.gray500};
    pointer-events: none;
  }

  & > svg {
    margin: auto;
    width: ${({ chipType }) => chipSize[chipType].icon.width};
    height: ${({ chipType }) => chipSize[chipType].icon.height};
  }
`;

ChipContainer.propTypes = {
  isSmall: PropTypes.bool,
};

const BookmarkChip = ({
  isBookmarked,
  chipType = CHIP_TYPES.STANDARD,
  ...rest
}) => {
  return (
    <ChipContainer isBookmarked={isBookmarked} chipType={chipType} {...rest}>
      {isBookmarked ? <BookmarkFill /> : <BookmarkOutline />}
    </ChipContainer>
  );
};

BookmarkChip.propTypes = {
  isBookmarked: PropTypes.bool,
  chipType: PropTypes.oneOf(Object.values(CHIP_TYPES)),
};

export default BookmarkChip;
