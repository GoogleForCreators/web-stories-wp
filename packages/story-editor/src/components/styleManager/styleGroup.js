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
import { useState, useRef } from '@googleforcreators/react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { SAVED_STYLE_HEIGHT, PRESET_TYPES } from '../../constants';
import useKeyboardNavigation from './useKeyboardNavigation';
import StyleItem from './styleItem';

const Group = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 16px;
`;

const ButtonWrapper = styled.div`
  height: ${SAVED_STYLE_HEIGHT}px;
  width: ${({ width }) => width}px;
`;

function StyleGroup({
  styles,
  isEditMode = false,
  handleClick,
  buttonWidth = 128,
  ...rest
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const groupRef = useRef(null);

  useKeyboardNavigation({
    activeIndex,
    setActiveIndex,
    groupRef,
    type: PRESET_TYPES.STYLE,
  });

  return (
    <Group ref={groupRef}>
      {styles.map((style, i) => (
        <ButtonWrapper key={JSON.stringify(style)} width={buttonWidth}>
          <StyleItem
            style={style}
            i={i}
            activeIndex={activeIndex}
            handleOnClick={handleClick}
            isEditMode={isEditMode}
            {...rest}
          />
        </ButtonWrapper>
      ))}
    </Group>
  );
}

StyleGroup.propTypes = {
  styles: PropTypes.array.isRequired,
  handleClick: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  buttonWidth: PropTypes.number,
};

export default StyleGroup;
