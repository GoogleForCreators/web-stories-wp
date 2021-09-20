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
import { useEffect } from '@web-stories-wp/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { createSolid, PatternPropType } from '@web-stories-wp/patterns';
import {
  Button,
  Icons,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from '@web-stories-wp/design-system';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import CurrentColorPicker from './currentColorPicker';
import GradientPicker from './gradientPicker';
import Header from './header';
import PatternTypePicker from './patternTypePicker';
import useColor from './useColor';
import AddCustomColor from './addCustomColor';

const Body = styled.div`
  display: flex;
  flex-direction: column;
`;

function CustomColorPicker({
  color,
  allowsGradient,
  allowsOpacity,
  handleColorChange,
  handleClose,
  hideCustomPicker,
  allowsSavedColors,
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
      <Body>
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
          onChange={updateCurrentColor}
          showOpacity={allowsOpacity}
        />
        {allowsSavedColors && (
          <AddCustomColor
            color={generatedColor || color}
            onSave={hideCustomPicker}
          />
        )}
      </Body>
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
};

export default CustomColorPicker;
