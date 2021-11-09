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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  useDebouncedCallback,
  useFocusOut,
  useRef,
  useState,
  useCallback,
} from '@web-stories-wp/react';
import { __ } from '@web-stories-wp/i18n';
import { PatternPropType, hasGradient } from '@web-stories-wp/patterns';
import { useKeyDownEffect } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import useFocusTrapping from '../../utils/useFocusTrapping';
import { useTransform } from '../transform';
import useStory from '../../app/story/useStory';
import CustomColorPicker from './customColorPicker';
import BasicColorPicker from './basicColorPicker';

const Container = styled.div`
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.bg.secondary};
  width: 256px;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: hidden;

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

function ColorPicker({
  onChange,
  isEyedropperActive = false,
  color = null,
  allowsGradient = false,
  allowsOpacity = true,
  allowsSavedColors = false,
  onClose = () => {},
  changedStyle = 'background',
  onDimensionChange = () => {},
}) {
  const [showDialog, setShowDialog] = useState(false);
  // If initial color is a gradient, start by showing a custom color picker.
  // Note that no such switch happens if the color later changes to a gradient,
  // only if it was a gradient at the moment the color picker mounted.
  const [isCustomPicker, setCustomPicker] = useState(hasGradient(color));
  const showCustomPicker = useCallback(() => {
    setCustomPicker(true);
    onDimensionChange();
  }, [onDimensionChange]);
  const hideCustomPicker = useCallback(() => {
    setCustomPicker(false);
    onDimensionChange();
  }, [onDimensionChange]);

  const {
    actions: { pushTransform },
  } = useTransform();

  const { selectedElementIds = [] } = useStory(
    ({ state: { selectedElementIds } }) => ({ selectedElementIds })
  );

  const onDebouncedChange = useDebouncedCallback(onChange, 100, {
    leading: true,
  });

  const handleColorChange = useCallback(
    (newColor) => {
      onDebouncedChange(newColor);
      selectedElementIds.forEach((id) => {
        pushTransform(id, {
          color: newColor,
          style: changedStyle,
          staticTransformation: true,
        });
      });
    },
    [onDebouncedChange, selectedElementIds, changedStyle, pushTransform]
  );

  const maybeClose = () => {
    // Usually we close the color picker when focusing anywhere outside of it.
    // There's an exception for when the eyedropper is in use or when a confirmation dialog is open
    // since both cause focusing outside of the color picker for interacting by the user, but the picker needs to stay open.
    if (!isEyedropperActive && !showDialog) {
      onClose();
    }
  };

  // Detect focus out of color picker (clicks or focuses outside)
  const containerRef = useRef();
  useFocusOut(containerRef, maybeClose, [isEyedropperActive, showDialog]);

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

  const ActualColorPicker = isCustomPicker
    ? CustomColorPicker
    : BasicColorPicker;

  return (
    <CSSTransition in appear classNames="picker" timeout={300}>
      <Container
        role="dialog"
        aria-label={__('Color and gradient picker', 'web-stories')}
        ref={containerRef}
      >
        <ActualColorPicker
          color={color}
          allowsGradient={allowsGradient}
          allowsOpacity={allowsOpacity}
          handleColorChange={handleColorChange}
          showCustomPicker={showCustomPicker}
          hideCustomPicker={hideCustomPicker}
          handleClose={handleCloseAndRefocus}
          allowsSavedColors={allowsSavedColors}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
        />
      </Container>
    </CSSTransition>
  );
}

ColorPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  allowsGradient: PropTypes.bool,
  allowsOpacity: PropTypes.bool,
  allowsSavedColors: PropTypes.bool,
  isEyedropperActive: PropTypes.bool,
  color: PatternPropType,
  changedStyle: PropTypes.string,
  onDimensionChange: PropTypes.func,
};

export default ColorPicker;
