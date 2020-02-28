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

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useFont } from '../../../app/font';
import { dataPixels } from '../../../units';
import { calculateTextHeight } from '../../../utils/textMeasurements';
import calcRotatedResizeOffset from '../../../utils/calcRotatedResizeOffset';
import removeUnsetValues from '../utils/removeUnsetValues';
import getCommonValue from '../utils/getCommonValue';
import { SimplePanel } from '../panel';
import TextStyleControls from './textStyle';
import ColorControls from './color';
import PaddingControls from './padding';
import FontControls from './font';

function StylePanel({ selectedElements, onSetProperties }) {
  // TextStyle settings
  const textAlign = getCommonValue(selectedElements, 'textAlign');
  const letterSpacing = getCommonValue(selectedElements, 'letterSpacing');
  const lineHeight = getCommonValue(selectedElements, 'lineHeight');
  const fontStyle = getCommonValue(selectedElements, 'fontStyle');
  const textDecoration = getCommonValue(selectedElements, 'textDecoration');
  const bold = getCommonValue(selectedElements, 'bold');

  const padding = getCommonValue(selectedElements, 'padding') ?? '';

  // Font settings.
  const fontFamily = getCommonValue(selectedElements, 'fontFamily');
  const fontSize = getCommonValue(selectedElements, 'fontSize');
  const fontWeight = getCommonValue(selectedElements, 'fontWeight');
  const fontWeights = getCommonValue(selectedElements, 'fontWeights');
  const fontFallback = getCommonValue(selectedElements, 'fontFallback');

  // Color settings.
  const color = getCommonValue(selectedElements, 'color');
  const backgroundColor = getCommonValue(selectedElements, 'backgroundColor');
  const backgroundOpacity = getCommonValue(
    selectedElements,
    'backgroundOpacity'
  );
  const textOpacity = getCommonValue(selectedElements, 'textOpacity');

  const {
    actions: { getFontWeight, getFontFallback },
  } = useFont();

  const [state, setState] = useState({
    backgroundColor,
    backgroundOpacity,
    bold,
    color,
    fontFamily,
    fontStyle,
    fontSize,
    fontWeight,
    fontFallback,
    fontWeights,
    textDecoration,
    textAlign,
    textOpacity,
    letterSpacing,
    lineHeight,
    padding,
  });
  const [lockPaddingRatio, setLockPaddingRatio] = useState(true);
  useEffect(() => {
    const currentFontWeights = getFontWeight(fontFamily);
    const currentFontFallback = getFontFallback(fontFamily);
    setState({
      backgroundColor,
      backgroundOpacity,
      bold,
      color,
      textOpacity,
      textAlign,
      letterSpacing,
      lineHeight,
      padding,
      fontFamily,
      fontStyle,
      fontSize,
      fontWeight,
      fontWeights: currentFontWeights,
      fontFallback: currentFontFallback,
      textDecoration,
    });
  }, [
    bold,
    color,
    textOpacity,
    textAlign,
    letterSpacing,
    lineHeight,
    padding,
    getFontWeight,
    fontFamily,
    getFontFallback,
    fontStyle,
    fontSize,
    fontWeight,
    textDecoration,
    backgroundColor,
    backgroundOpacity,
  ]);
  const handleSubmit = (evt) => {
    onSetProperties(state);
    onSetProperties((properties) => {
      const {
        padding: oldPadding,
        width,
        height: oldHeight,
        rotationAngle,
        x,
        y,
      } = properties;
      const { padding: newPadding } = state;
      const updatedState = removeUnsetValues(state);
      const newProperties = { ...properties, ...updatedState };
      const newHeight = dataPixels(calculateTextHeight(newProperties, width));
      const [dx, dy] = calcRotatedResizeOffset(
        rotationAngle,
        0,
        0,
        0,
        newHeight - oldHeight
      );
      const ratio = getPaddingRatio(oldPadding.horizontal, oldPadding.vertical);
      if (
        lockPaddingRatio &&
        (newPadding.horizontal === '' || newPadding.vertical === '') &&
        ratio
      ) {
        if (newPadding.horizontal === '') {
          newPadding.horizontal = Math.round(newPadding.vertical * ratio);
        } else {
          newPadding.horizontal = Math.round(newPadding.horizontal / ratio);
        }
      }
      return {
        ...updatedState,
        height: newHeight,
        x: dataPixels(x + dx),
        y: dataPixels(y + dy),
        padding: newPadding,
      };
    });
    evt.preventDefault();
  };

  const getPaddingRatio = (horizontal, vertical) => {
    if (!vertical || !horizontal) {
      return false;
    }
    return horizontal / vertical;
  };

  return (
    <SimplePanel
      name="style"
      title={__('Style', 'web-stories')}
      onSubmit={handleSubmit}
    >
      <FontControls
        properties={{ fontFamily, fontWeight, fontSize }}
        setState={setState}
        state={state}
      />
      <TextStyleControls
        state={state}
        setState={setState}
        properties={{
          lineHeight,
          letterSpacing,
          fontStyle,
          textAlign,
          textDecoration,
        }}
      />
      <ColorControls
        state={state}
        setState={setState}
        properties={{
          backgroundColor,
          backgroundOpacity,
          color,
          textOpacity,
        }}
      />
      <PaddingControls
        getPaddingRatio={getPaddingRatio}
        properties={{ padding }}
        state={state}
        lockPaddingRatio={lockPaddingRatio}
        setLockPaddingRatio={setLockPaddingRatio}
        setState={setState}
      />
    </SimplePanel>
  );
}

StylePanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default StylePanel;
