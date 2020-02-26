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
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { InputGroup, SelectMenu } from '../../form';
import { useFont } from '../../../app/font';
import { dataPixels } from '../../../units';
import { calculateTextHeight } from '../../../utils/textMeasurements';
import calcRotatedResizeOffset from '../../../utils/calcRotatedResizeOffset';
import { MAX_FONT_SIZE, MIN_FONT_SIZE } from '../../../constants';
import removeUnsetValues from '../utils/removeUnsetValues';
import getCommonValue from '../utils/getCommonValue';
import { SimplePanel } from '../panel';
import TextStyleControls from './textStyle';
import ColorControls from './color';

function StylePanel({ selectedElements, onSetProperties }) {
  // TextStyle settings
  const textAlign = getCommonValue(selectedElements, 'textAlign');
  const letterSpacing = getCommonValue(selectedElements, 'letterSpacing');
  const lineHeight = getCommonValue(selectedElements, 'lineHeight');
  const fontStyle = getCommonValue(selectedElements, 'fontStyle');
  const textDecoration = getCommonValue(selectedElements, 'textDecoration');

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

  const {
    state: { fonts },
    actions: { getFontWeight, getFontFallback },
  } = useFont();

  const [state, setState] = useState({
    backgroundColor,
    backgroundOpacity,
    color,
    fontFamily,
    fontStyle,
    fontSize,
    fontWeight,
    fontFallback,
    fontWeights,
    textDecoration,
    textAlign,
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
      color,
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
    color,
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
      {fonts && (
        <SelectMenu
          label={__('Font family', 'web-stories')}
          options={fonts}
          value={state.fontFamily}
          isMultiple={fontFamily === ''}
          onChange={(value) => {
            const currentFontWeights = getFontWeight(value);
            const currentFontFallback = getFontFallback(value);
            const fontWeightsArr = currentFontWeights.map(
              ({ thisValue }) => thisValue
            );
            const newFontWeight =
              fontWeightsArr && fontWeightsArr.includes(state.fontWeight)
                ? state.fontWeight
                : 400;
            setState({
              ...state,
              fontFamily: value,
              fontWeight: parseInt(newFontWeight),
              fontWeights: currentFontWeights,
              fontFallback: currentFontFallback,
            });
          }}
        />
      )}
      {state.fontWeights && (
        <SelectMenu
          label={__('Font weight', 'web-stories')}
          options={state.fontWeights}
          value={state.fontWeight}
          isMultiple={fontWeight === ''}
          onChange={(value) =>
            setState({ ...state, fontWeight: parseInt(value) })
          }
        />
      )}
      <InputGroup
        type="number"
        label={__('Font size', 'web-stories')}
        value={state.fontSize}
        isMultiple={fontSize === ''}
        postfix={'px'}
        min={MIN_FONT_SIZE}
        max={MAX_FONT_SIZE}
        onChange={(value) => setState({ ...state, fontSize: parseInt(value) })}
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
        }}
      />
      <InputGroup
        label={__('Padding Horizontal', 'web-stories')}
        value={state.padding.horizontal}
        isMultiple={'' === padding}
        onChange={(value) => {
          const ratio = getPaddingRatio(padding.horizontal, padding.vertical);
          const newPadding = {
            horizontal: isNaN(value) || '' === value ? '' : parseInt(value),
          };
          newPadding.vertical =
            typeof padding.horizontal === 'number' && lockPaddingRatio && ratio
              ? Math.round(parseInt(newPadding.horizontal) / ratio)
              : padding.vertical;
          setState({ ...state, padding: newPadding });
        }}
        postfix={_x('%', 'Percentage', 'web-stories')}
      />
      <InputGroup
        label={__('Padding Vertical', 'web-stories')}
        value={state.padding.vertical}
        isMultiple={'' === padding}
        onChange={(value) => {
          const ratio = getPaddingRatio(padding.horizontal, padding.vertical);
          const newPadding = {
            vertical: isNaN(value) || '' === value ? '' : parseInt(value),
          };
          newPadding.horizontal =
            padding.horizontal !== '' &&
            typeof padding.vertical === 'number' &&
            lockPaddingRatio &&
            ratio
              ? Math.round(parseInt(newPadding.vertical) / ratio)
              : padding.horizontal;
          setState({ ...state, padding: newPadding });
        }}
        postfix={_x('%', 'Percentage', 'web-stories')}
      />
      <InputGroup
        type="checkbox"
        label={__('Keep padding ratio', 'web-stories')}
        value={lockPaddingRatio}
        isMultiple={false}
        onChange={(value) => {
          setLockPaddingRatio(value);
        }}
      />
    </SimplePanel>
  );
}

StylePanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default StylePanel;
