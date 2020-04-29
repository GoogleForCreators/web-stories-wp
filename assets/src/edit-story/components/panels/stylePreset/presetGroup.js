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

/**
 * Internal dependencies
 */
import { useKeyDownEffect } from '../../keyboard';

const COLORS_PER_ROW = 6;
const STYLES_PER_ROW = 3;
const PRESET_HEIGHT = 35;

const Group = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const ButtonWrapper = styled.div`
  flex-basis: ${({ width }) => width}%;
  height: ${PRESET_HEIGHT}px;
`;

const Label = styled.div`
  color: ${({ theme }) => theme.colors.fg.v1};
  font-size: 10px;
  line-height: 12px;
  text-transform: uppercase;
  padding: 6px 0;
`;

function PresetGroup({ presets, itemRenderer, type, label }) {
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
        const rowLength = 'color' === type ? COLORS_PER_ROW : STYLES_PER_ROW;
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
    [activeIndex]
  );

  const buttonWidth =
    'color' === type ? 100 / COLORS_PER_ROW : 100 / STYLES_PER_ROW;
  return (
    <>
      <Label>{label}</Label>
      <Group ref={groupRef}>
        {presets.map((preset, i) => (
          <ButtonWrapper key={i} width={buttonWidth}>
            {itemRenderer(preset, i, activeIndex)}
          </ButtonWrapper>
        ))}
      </Group>
    </>
  );
}

PresetGroup.propTypes = {
  presets: PropTypes.array.isRequired,
  itemRenderer: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default PresetGroup;
