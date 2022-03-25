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
import { useCallback, useEffect, useRef } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import { createSolid, PatternPropType } from '@googleforcreators/patterns';
import {
  Button,
  Icons,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import CurrentColorPicker from './currentColorPicker';
import GradientPicker from './gradientPicker';
import Header from './header';
import PatternTypePicker from './patternTypePicker';
import useColor from './useColor';
import AddCustomColor from './addCustomColor';

function CustomColorPicker({
  color,
  allowsGradient,
  allowsOpacity,
  handleColorChange,
  handleClose,
  hideCustomPicker,
  allowsSavedColors,
  hasEyedropper,
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

  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // If color picker isn't mounted while using eyedropper, generatedColor won't update.
  useEffect(() => {
    if (generatedColor) {
      handleColorChange(generatedColor);
    }
  }, [handleColorChange, generatedColor]);

  useEffect(() => {
    if (color) {
      load(color);
    } else {
      // If no color given, load solid black
      load(createSolid(0, 0, 0));
    }
  }, [color, load]);

  const handleColorPickerChange = useCallback(
    (e) => {
      updateCurrentColor(e);
      // If using the eyedropper in floating menu, the popup unmounts
      // so the generatedColor won't ever be updated
      // check for unmount and if so, we know this change event
      // if from the eyedropper so we can just grab the rgb and
      // trigger the rest of the change for the element.
      if (!isMounted.current && e?.rgb) {
        handleColorChange({ color: e.rgb });
      }
    },
    [updateCurrentColor, handleColorChange]
  );

  return (
    <>
      <Header handleClose={handleClose}>
        <Button
          aria-label={__('Go back', 'web-stories')}
          onClick={hideCustomPicker}
          type={BUTTON_TYPES.TERTIARY}
          size={BUTTON_SIZES.SMALL}
          variant={BUTTON_VARIANTS.SQUARE}
        >
          <Icons.ArrowLeft />
        </Button>
      </Header>
      {allowsGradient && (
        <PatternTypePicker
          type={type}
          setToGradient={setToGradient}
          setToSolid={setToSolid}
        />
      )}
      {type !== 'solid' && (
        <GradientPicker
          stops={stops}
          currentStopIndex={currentStopIndex}
          onSelect={selectStop}
          onReverse={reverseStops}
          onAdd={addStopAt}
          onDelete={removeCurrentStop}
          onRotate={rotateClockwise}
          onMove={moveCurrentStopBy}
          type={type}
        />
      )}
      <CurrentColorPicker
        color={currentColor}
        onChange={handleColorPickerChange}
        showOpacity={allowsOpacity}
        hasEyedropper={hasEyedropper}
      />
      {allowsSavedColors && (
        <AddCustomColor
          color={generatedColor || color}
          onSave={hideCustomPicker}
        />
      )}
    </>
  );
}

CustomColorPicker.propTypes = {
  handleColorChange: PropTypes.func.isRequired,
  handleClose: PropTypes.func,
  hideCustomPicker: PropTypes.func.isRequired,
  allowsGradient: PropTypes.bool,
  allowsOpacity: PropTypes.bool,
  allowsSavedColors: PropTypes.bool,
  color: PatternPropType,
  hasEyedropper: PropTypes.bool,
};

export default CustomColorPicker;
