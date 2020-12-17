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
 * Internal dependencies
 */
import { useKeyDownEffect } from '../../../keyboard';
import {
  COLOR_PRESETS_PER_ROW,
  STYLE_PRESETS_PER_ROW,
} from '../../../../constants';

const COLOR_SIZE = 30;
const STYLE_HEIGHT = 48;
const STYLE_WIDTH = 112;

const Group = styled.div`
  display: grid;
  grid-template-columns: repeat(
    ${({ type }) => (type === 'color' ? 6 : 2)},
    1fr
  );
  grid-column-gap: 10px;
  grid-row-gap: 10px;
`;

const ButtonWrapper = styled.div`
  height: ${({ type }) => (type === 'color' ? COLOR_SIZE : STYLE_HEIGHT)}px;
  width: ${({ type }) => (type === 'color' ? COLOR_SIZE : STYLE_WIDTH)}px;
  margin: auto;
`;

function PresetGroup({ presets, itemRenderer, type, handleClick, isEditMode }) {
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
      // When the user navigates in the color presets using the arrow keys,
      // Let's change the active index accordingly, to indicate which preset should be focused
      if (groupRef.current) {
        const rowLength =
          'color' === type ? COLOR_PRESETS_PER_ROW : STYLE_PRESETS_PER_ROW;
        const diff = getIndexDiff(key, rowLength);
        const maxIndex = presets.length - 1;
        const val = (activeIndex ?? 0) + diff;
        const newIndex = Math.max(0, Math.min(maxIndex, val));
        setActiveIndex(newIndex);
        const buttons = groupRef.current.querySelectorAll('button');
        if (buttons[newIndex]) {
          buttons[newIndex].focus();
        }
      }
    },
    [activeIndex, presets.length, type]
  );

  // Make sure index stays within the length (user can delete last element)
  useEffect(() => {
    if (activeIndex >= presets.length) {
      setActiveIndex(presets.length - 1);
    }
  }, [activeIndex, presets.length]);

  return (
    <Group ref={groupRef} type={type}>
      {presets.map((preset, i) => (
        <ButtonWrapper key={i} type={type}>
          {itemRenderer(preset, i, activeIndex, handleClick, isEditMode)}
        </ButtonWrapper>
      ))}
    </Group>
  );
}

PresetGroup.propTypes = {
  presets: PropTypes.array.isRequired,
  itemRenderer: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
};

export default PresetGroup;
