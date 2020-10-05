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
import { CSSTransition } from 'react-transition-group';
import { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDebouncedCallback } from 'use-debounce';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { PatternPropType } from '../../types';
import { useKeyDownEffect } from '../keyboard';
import useFocusOut from '../../utils/useFocusOut';
import createSolid from '../../utils/createSolid';
import useFocusTrapping from '../../utils/useFocusTrapping';
import CurrentColorPicker from './currentColorPicker';
import GradientPicker from './gradientPicker';
import Header from './header';
import useColor from './useColor';

const Container = styled.div`
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.bg.v8};
  color: ${({ theme }) => theme.colors.fg.white};
  width: 240px;
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  &.picker-appear {
    opacity: 0.01;
    margin-top: -10px;

    &.picker-appear-active {
      opacity: 1;
      margin-top: 0;
      transition: 300ms ease-out;
      transition-property: opacity, margin-top;
    }
  }
`;

const Body = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.fg.v6};
`;

function ColorPicker({
  color,
  hasGradient,
  hasOpacity,
  onChange,
  onClose,
  renderFooter,
}) {
  const {
    state: { type, stops, currentStopIndex, currentColor, generatedColor },
    actions: {
      load,
      updateCurrentColor,
      reverseStops,
      selectStop,
      addStopAt,
      removeCurrentStop,
      rotateClockwise,
      moveCurrentStopBy,
      setToSolid,
      setToGradient,
    },
  } = useColor();

  const [onDebouncedChange] = useDebouncedCallback(onChange, 100, {
    leading: true,
  });

  useEffect(() => {
    if (generatedColor) {
      onDebouncedChange(generatedColor);
    }
  }, [color, generatedColor, onDebouncedChange]);

  useEffect(() => {
    if (color) {
      load(color);
    } else {
      // If no color given, load solid black
      load(createSolid(0, 0, 0));
    }
  }, [color, load]);

  // Detect focus out of color picker (clicks or focuses outside)
  const containerRef = useRef();
  useFocusOut(containerRef, onClose);

  // Re-establish focus when actively exiting by button or key press
  const previousFocus = useRef(document.activeElement);
  const handleCloseAndRefocus = useCallback(
    (evt) => {
      // Ignore reason: In Jest, focus is always on document.body if not on any specific
      // element, so it can never be falsy, as it can be in a real browser.

      // istanbul ignore else
      if (previousFocus.current) {
        previousFocus.current.focus();
      }
      onClose(evt);
    },
    [onClose]
  );

  useKeyDownEffect(containerRef, 'esc', handleCloseAndRefocus);
  useFocusTrapping({ ref: containerRef });

  return (
    <CSSTransition in appear={true} classNames="picker" timeout={300}>
      <Container
        role="dialog"
        aria-label={__('Color and gradient picker', 'web-stories')}
        ref={containerRef}
      >
        <Header
          hasGradient={hasGradient}
          type={type}
          setToGradient={setToGradient}
          setToSolid={setToSolid}
          onClose={handleCloseAndRefocus}
        />
        {type !== 'solid' && (
          <Body>
            <GradientPicker
              stops={stops}
              currentStopIndex={currentStopIndex}
              onSelect={selectStop}
              onReverse={reverseStops}
              onAdd={addStopAt}
              onDelete={removeCurrentStop}
              onRotate={rotateClockwise}
              onMove={moveCurrentStopBy}
            />
          </Body>
        )}
        <Body>
          <CurrentColorPicker
            color={currentColor}
            onChange={updateCurrentColor}
            showOpacity={hasOpacity}
          />
          {renderFooter && renderFooter(color)}
        </Body>
      </Container>
    </CSSTransition>
  );
}

ColorPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  hasGradient: PropTypes.bool,
  hasOpacity: PropTypes.bool,
  color: PatternPropType,
  renderFooter: PropTypes.func,
};

ColorPicker.defaultProps = {
  color: null,
  // Ignore reason: Just a default handler
  onClose: /* istanbul ignore next */ () => {},
  hasGradient: false,
  hasOpacity: true,
  renderFooter: null,
};

export default ColorPicker;
