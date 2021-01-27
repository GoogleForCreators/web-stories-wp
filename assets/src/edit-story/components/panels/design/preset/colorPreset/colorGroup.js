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
import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useKeyDownEffect } from '../../../../../../design-system';
import {
  COLOR_PRESETS_PER_ROW,
  SAVED_COLOR_SIZE,
} from '../../../../../constants';
import ColorAdd from './colorAdd';
import Color from './color';

const Group = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-column-gap: 10px;
  grid-row-gap: 10px;
`;

const ButtonWrapper = styled.div`
  height: ${SAVED_COLOR_SIZE}px;
  width: ${SAVED_COLOR_SIZE}px;
  margin: auto;
`;

function ColorGroup({
  colors,
  isEditMode,
  handleAddPreset,
  isLocal,
  handleClick,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const groupRef = useRef(null);

  const getIndexDiff = (key, rowLength) => {
    switch (key) {
      case 'ArrowUp':
        return -rowLength;
      case 'ArrowDown':
        return rowLength;
      case 'ArrowLeft':
        return -1;
      case 'ArrowRight':
        return 1;
      default:
        return 0;
    }
  };

  useKeyDownEffect(
    groupRef,
    { key: ['up', 'down', 'left', 'right'] },
    ({ key }) => {
      // When the user navigates in the colors using the arrow keys,
      // Let's change the active index accordingly, to indicate which preset should be focused
      if (groupRef.current) {
        const diff = getIndexDiff(key, COLOR_PRESETS_PER_ROW);
        const maxIndex = colors.length - 1;
        const val = (activeIndex ?? 0) + diff;
        const newIndex = Math.max(0, Math.min(maxIndex, val));
        setActiveIndex(newIndex);
        const buttons = groupRef.current.querySelectorAll('button');
        if (buttons[newIndex]) {
          buttons[newIndex].focus();
        }
      }
    },
    [activeIndex, colors.length]
  );

  // Make sure index stays within the length (user can delete last element)
  useEffect(() => {
    if (activeIndex >= colors.length) {
      setActiveIndex(colors.length - 1);
    }
  }, [activeIndex, colors.length]);

  const displayAddIcon = !isEditMode;

  return (
    <Group ref={groupRef}>
      {colors.map((color, i) => (
        <ButtonWrapper key={JSON.stringify(color)}>
          <Color
            color={color}
            i={i}
            activeIndex={activeIndex}
            handleOnClick={handleClick}
            isEditMode={isEditMode}
            isLocal={true}
          />
        </ButtonWrapper>
      ))}
      {displayAddIcon && (
        <ButtonWrapper>
          <ColorAdd
            handleAddPreset={handleAddPreset}
            aria-label={
              isLocal
                ? __('Add local color', 'web-stories')
                : __('Add global color', 'web-stories')
            }
          />
        </ButtonWrapper>
      )}
    </Group>
  );
}

ColorGroup.propTypes = {
  colors: PropTypes.array.isRequired,
  handleClick: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  handleAddPreset: PropTypes.func.isRequired,
  isLocal: PropTypes.bool,
};

export default ColorGroup;
