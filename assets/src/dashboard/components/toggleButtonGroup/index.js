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
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import { BEZIER } from '../../../animation';
import { KEYBOARD_USER_SELECTOR } from '../../constants';
import { TypographyPresets } from '../typography';

const ToggleButtonContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: row;
  justify-content: space-evenly;
`;

const AnimationBar = styled.div`
  ${({ theme, selectedButtonWidth = 0, selectedButtonLeft = 0 }) => `
    position: relative;
    height: 3px;
    width: ${selectedButtonWidth}px;
    margin-left: ${selectedButtonLeft}%;
    background-color:  ${theme.internalTheme.colors.bluePrimary600};
    transition: all 0.3s ${BEZIER.outSine};
  `}
`;
AnimationBar.propTypes = {
  selectedButtonWidth: PropTypes.number,
  selectedButtonLeft: PropTypes.number,
};

const ToggleButton = styled.button`
  ${TypographyPresets.Medium};
  cursor: pointer;

  ${({ theme, isActive }) => `
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    outline: none;
    border: none;
    padding: 0;
    margin: 0;
    font-weight: ${theme.internalTheme.typography.weight.bold};
    color: ${
      isActive
        ? theme.internalTheme.colors.gray900
        : theme.internalTheme.colors.gray600
    };
    background-color: transparent;

    ${KEYBOARD_USER_SELECTOR} &:focus {
        border: 1px solid ${theme.internalTheme.colors.action};
    }
    &:disabled {
      color: ${theme.internalTheme.colors.gray400};
      cursor: default;
    }
  `}
`;

ToggleButton.propTypes = {
  isActive: PropTypes.bool,
};

const ToggleButtonGroup = ({ buttons }) => {
  const [selectedButton, setSelectedButton] = useState(null);
  const [containerWidth, setContainerWidth] = useState(null);
  const activeRef = useRef(null);
  const containerRef = useRef(null);

  const updateBarDimensions = useCallback(
    (target) => {
      const activeBounds = target.getBoundingClientRect();
      const containerBounds = containerRef.current.getBoundingClientRect();

      const percentageToLeft =
        ((activeBounds.left - containerBounds.left) / containerWidth) * 100;

      setSelectedButton({
        x: percentageToLeft,
        width: activeBounds.width,
      });
    },
    [containerWidth]
  );

  // this layout effect hook will take care of setting
  //   the initial selectedButton state with left/width property
  //   of active button after first paint
  //   as well as the container x position we will use to gauge the margin for animation
  useLayoutEffect(() => {
    if (!activeRef.current) {
      return;
    }
    updateBarDimensions(activeRef.current);
  }, [updateBarDimensions]);

  useEffect(() => {
    if (typeof window == 'undefined' || !containerRef.current) {
      return () => {};
    }

    const resizeContainerObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        // window.requestAnimationFrame removes potential for ResizeObserver - loop limit exceeded error
        // see https://stackoverflow.com/a/50387233/13078978
        window.requestAnimationFrame(() => {
          if (entry.contentRect.width !== containerWidth) {
            setContainerWidth(entry.contentRect.width);
          }
        });
      });
    });

    const resizeEl = containerRef.current;
    resizeContainerObserver.observe(resizeEl);
    return () => {
      resizeContainerObserver.unobserve(resizeEl);
    };
  }, [containerWidth]);

  const handleButtonClick = useCallback(
    (e, handleClick) => {
      updateBarDimensions(e.currentTarget);
      handleClick && handleClick();
    },
    [updateBarDimensions]
  );

  // if buttons is not present we do not want to render the component
  if (!buttons || buttons.length <= 0) {
    return null;
  }
  return (
    <>
      <ToggleButtonContainer ref={containerRef}>
        {buttons.map(({ isActive, handleClick, key, text, ...rest }, idx) => (
          <ToggleButton
            {...(isActive ? { ref: activeRef } : {})}
            type="button"
            onClick={(e) => handleButtonClick(e, handleClick)}
            key={key || `toggle_button_${idx}`}
            isActive={isActive}
            {...rest}
          >
            {text}
          </ToggleButton>
        ))}
      </ToggleButtonContainer>
      <AnimationBar
        selectedButtonWidth={selectedButton?.width}
        selectedButtonLeft={selectedButton?.x}
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
