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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { CARD_TITLE_AREA_HEIGHT } from '../../constants';
import { TextInput } from '../input';
import useFocusOut from '../../utils/useFocusOut';

const StyledCardTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.storyGridItem.family};
  font-size: ${({ theme }) => theme.fonts.storyGridItem.size};
  font-weight: ${({ theme }) => theme.fonts.storyGridItem.weight};
  letter-spacing: ${({ theme }) => theme.fonts.storyGridItem.letterSpacing};
  line-height: ${({ theme }) => theme.fonts.storyGridItem.lineHeight};
  padding-top: 12px;
  max-width: 80%;
  height: ${CARD_TITLE_AREA_HEIGHT}px;
`;

const StyledTitle = styled.p`
  color: ${({ theme }) => theme.colors.gray900};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledDate = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray500};
  font-weight: ${({ theme }) => theme.fonts.storyGridItemSub.weight};
  font-family: ${({ theme }) => theme.fonts.storyGridItemSub.family};
`;

const CardTitle = ({
  title,
  modifiedDate,
  editMode,
  onEditComplete,
  onEditCancel,
}) => {
  const inputContainerRef = useRef(null);
  const [newTitle, setNewTitle] = useState(title);

  useFocusOut(
    inputContainerRef,
    () => {
      if (editMode) {
        onEditCancel();
      }
    },
    [editMode]
  );

  const handleChange = useCallback(({ target }) => {
    setNewTitle(target.value);
  }, []);

  const handleKeyPress = useCallback(
    ({ nativeEvent }) => {
      if (nativeEvent.keyCode === 13) {
        onEditComplete(newTitle);
      } else if (nativeEvent.keyCode === 27) {
        onEditCancel();
      }
    },
    [newTitle, onEditComplete, onEditCancel]
  );

  return (
    <StyledCardTitle>
      {editMode ? (
        <div ref={inputContainerRef}>
          <TextInput
            data-testid={'title-rename-input'}
            value={newTitle}
            onKeyDown={handleKeyPress}
            onChange={handleChange}
          />
        </div>
      ) : (
        <StyledTitle>{title}</StyledTitle>
      )}
      <StyledDate>{`
      ${__('Modified', 'web-stories')} ${modifiedDate} `}</StyledDate>
    </StyledCardTitle>
  );
};

CardTitle.propTypes = {
  title: PropTypes.string.isRequired,
  editMode: PropTypes.bool,
  modifiedDate: PropTypes.string.isRequired,
  onEditComplete: PropTypes.func.isRequired,
  onEditCancel: PropTypes.func.isRequired,
};

export default CardTitle;
