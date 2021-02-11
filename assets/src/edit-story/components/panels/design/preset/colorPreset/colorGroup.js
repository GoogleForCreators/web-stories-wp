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
import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { SAVED_COLOR_SIZE } from '../../../../../constants';
import useKeyboardNavigation from '../useKeyboardNavigation';
import ColorAdd from './colorAdd';
import Color from './color';

const Group = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-column-gap: ${({ colorGap }) => colorGap}px;
  grid-row-gap: ${({ colorGap }) => colorGap}px;
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
  displayAdd,
  colorGap = 10,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const groupRef = useRef(null);

  useKeyboardNavigation({
    activeIndex,
    setActiveIndex,
    groupRef,
  });

  return (
    <Group ref={groupRef} colorGap={colorGap}>
      {colors.map((color, i) => (
        <ButtonWrapper key={JSON.stringify(color)}>
          <Color
            color={color}
            i={i}
            activeIndex={activeIndex}
            handleOnClick={handleClick}
            isEditMode={isEditMode}
            isLocal={isLocal}
          />
        </ButtonWrapper>
      ))}
      {displayAdd && (
        <ButtonWrapper>
          <ColorAdd
            tabIndex={0}
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
  handleAddPreset: PropTypes.func,
  isLocal: PropTypes.bool,
  displayAdd: PropTypes.bool.isRequired,
  colorGap: PropTypes.number,
};

export default ColorGroup;
