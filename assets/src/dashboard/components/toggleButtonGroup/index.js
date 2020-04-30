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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useState, useCallback, useLayoutEffect, useRef } from 'react';

/**
 * Internal dependencies
 */
import { KEYBOARD_USER_SELECTOR } from '../../constants';

const ToggleButtonContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: row;
  justify-content: space-evenly;
`;

const AnimationBar = styled.div`
  ${({ theme, selectedButtonWidth = 0, selectedButtonLeft = 0 }) => `
    height: 3px;
    background-color:  ${theme.colors.bluePrimary600};
    width: ${selectedButtonWidth}px;
    left: ${selectedButtonLeft}px;
    transition: all 0.3s ease-out; 
    position: absolute;
  `}
`;
AnimationBar.propTypes = {
  selectedButtonWidth: PropTypes.number,
  selectedButtonLeft: PropTypes.number,
};

const ToggleButton = styled.button`
  ${({ theme, isActive }) => `
  display: flex;
  background-color: transparent;
  flex-direction: column;
  justify-content: space-between;
  outline: none;
  border: none;
  padding: 0;
  margin: 0;
  font-size: ${theme.fonts.body1.size}px;
  font-family: ${theme.fonts.body1.family};
  font-weight: ${theme.fonts.body1.weight}};
  line-height: ${theme.fonts.body1.lineHeight}px;
  letter-spacing: ${theme.fonts.body1.letterSpacing}em;
  color: ${isActive ? theme.colors.gray900 : theme.colors.gray600};

  ${KEYBOARD_USER_SELECTOR} &:focus {
    border: 1px solid ${theme.colors.action};
  }
  `}
`;

ToggleButton.propTypes = {
  isActive: PropTypes.bool,
};

const ToggleButtonGroup = ({ buttons }) => {
  const [selectedButton, setSelectedButton] = useState();
  const activeRef = useRef(null);

  useLayoutEffect(() => {
    if (!activeRef || !activeRef.current) {
      return;
    }
    const { left, width } = activeRef.current.getBoundingClientRect();
    setSelectedButton({ left, width });
  }, []);

  return (
    <>
      <ToggleButtonContainer>
        {buttons.map(({ isActive, handleClick, key, text }, idx) => (
          <ToggleButton
            ref={isActive ? activeRef : null}
            type="button"
            onClick={useCallback(
              (e) => {
                const { left, width } = e.currentTarget.getBoundingClientRect();
                handleClick();
                setSelectedButton({ left, width });
              },
              [handleClick]
            )}
            key={key || `toggle_button_${idx}`}
            isActive={isActive}
          >
            {text}
          </ToggleButton>
        ))}
      </ToggleButtonContainer>
      <AnimationBar
        selectedButtonWidth={selectedButton?.width}
        selectedButtonLeft={selectedButton?.left}
      />
    </>
  );
};

const ToggleButtonShape = PropTypes.shape({
  handleClick: PropTypes.func,
  key: PropTypes.string,
  isActive: PropTypes.bool,
  text: PropTypes.string.isRequired,
});

ToggleButtonGroup.propTypes = {
  buttons: PropTypes.arrayOf(ToggleButtonShape).isRequired,
};

export default ToggleButtonGroup;
