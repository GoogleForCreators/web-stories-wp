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
import { useMemo, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
  Numeric,
  Row,
  DropDown,
  usePresubmitHandler,
  MULTIPLE_VALUE,
  MULTIPLE_DISPLAY_VALUE,
} from '../../form';
import FontPicker from '../../fontPicker';
import { useFont } from '../../../app/font';
import { getCommonValue } from '../utils';
import objectPick from '../../../utils/objectPick';
import stripHTML from '../../../utils/stripHTML';
import clamp from '../../../utils/clamp';
import useRichTextFormatting from './useRichTextFormatting';
import getClosestFontWeight from './getClosestFontWeight';
import getFontWeights from './getFontWeights';

const MIN_MAX = {
  FONT_SIZE: {
    MIN: 8,
    MAX: 800,
  },
};

const Space = styled.div`
  flex: 0 0 10px;
`;

const BoxedNumeric = styled(Numeric)`
  padding: 6px 6px;
  border-radius: 4px;
`;

function FontControls({ selectedElements, pushUpdate }) {
  const fontFamily = getCommonValue(
    selectedElements,
    ({ font }) => font?.family
  );
  const fontSize = getCommonValue(selectedElements, 'fontSize');

  const {
    textInfo: { fontWeight, isItalic },
    handlers: { handleSelectFontWeight },
  } = useRichTextFormatting(selectedElements, pushUpdate);

  const {
    fonts,
    addRecentFont,
    maybeEnqueueFontStyle,
    getFontByName,
  } = useFont(
    ({
      actions: { addRecentFont, maybeEnqueueFontStyle, getFontByName },
      state: { fonts },
    }) => ({
      addRecentFont,
      maybeEnqueueFontStyle,
      getFontByName,
      fonts,
    })
  );

  // These two refs and corresponding useEffect hooks are used to set font weights that need updating after new font families are selected and font weights are unavailable.
  // We only want to set these here the first time they have true values.
  // Because the editor has default weights we want to wait until the fontFamily is returned as part of getFontWeights (getFontByName) before setting the true current font weight. Otherwise we might set a default of 400 but really it should be 700.
  const fontWeightRef = useRef();
  const fontFamilyRef = useRef();
  useEffect(() => {
    if (fontFamily && !fontWeightRef.current) {
      fontWeightRef.current = fontWeight;
    }
  }, [fontWeight, fontFamily]);

  useEffect(() => {
    if (!fontFamilyRef?.current && fontFamily) {
      fontFamilyRef.current = fontFamily;
    }
  }, [fontFamily]);

  const fontWeights = useMemo(() => getFontWeights(getFontByName(fontFamily)), [
    getFontByName,
    fontFamily,
  ]);

  const fontStyle = isItalic ? 'italic' : 'normal';

  // order to check for potential font weight updates in:
  // 1. if the selected font family from an update in the font family dropdown does not match what fontFamily has currently, we should ignore the update. It's a flash of default content.
  // 2. if there is only 1 available weight for a font family, we should check to see if we should update.
  //    we should set the base weight to find closest to as the existing font weight if it is a number, otherwise use the single value from the returned font weights for the selected family.
  // 3. If there's more than 1 available weight, we now check to see if the set fontWeight is not a number (Multiple).
  //    If it's multiple at this point, just return out of the useEffect hook, no update.
  // 4. As a final check, we see if the closest value to the current font weight (it could be that existing font weight) is the same as the latest set ref for font weight - if it is we know we are current, if it's not we know we need to update. This is mostly a failsafe for inline updates when there are multiple font weights set and then a font family changes and that weight is no longer available. This avoids a crash of the editor and updates inline.
  useEffect(() => {
    // when the font family search is expanded there is a flash of default content
    // TODO: prevent this default font getting set
    if (fontFamilyRef.current !== fontFamily) {
      return;
    }

    const availableWeightValues = fontWeights.map((weight) => weight.value);
    // if there is only 1 font weight available we want to force an update to that weight to avoid the dropdown placeholder showing up since
    // the value cannot be located in the available list of weights.
    if (availableWeightValues.length === 1) {
      const weightToBaseUpdateOn = availableWeightValues[0];
      // if the weight to base the update on is different from what was previously set last time, we proceed with the update
      if (weightToBaseUpdateOn !== fontWeightRef.current) {
        fontWeightRef.current = weightToBaseUpdateOn;
        handleSelectFontWeight(weightToBaseUpdateOn);
      }
      return;
    }

    // if fontWeight is not a number it means there are multiple values for fontWeight within this text selection and we should not update anything
    if (isNaN(parseInt(fontWeight))) {
      return;
    }

    const newWeight = getClosestFontWeight(fontWeight, availableWeightValues);
    if (fontWeight !== newWeight) {
      fontWeightRef.current = newWeight;
      handleSelectFontWeight(newWeight);
      return;
    }

    if (fontWeight !== fontWeightRef.current) {
      fontWeightRef.current = fontWeight;
    }

    return;
  }, [fontFamily, fontWeight, fontWeights, handleSelectFontWeight]);

  const handleFontPickerChange = useCallback(
    async (value) => {
      const fontObj = fonts.find((item) => item.value === value);
      const newFont = {
        family: value,
        ...objectPick(fontObj, [
          'service',
          'fallbacks',
          'weights',
          'styles',
          'variants',
          'metrics',
        ]),
      };
      await maybeEnqueueFontStyle(
        selectedElements.map(({ content }) => {
          return {
            font: newFont,
            fontStyle,
            fontWeight,
            content: stripHTML(content),
          };
        })
      );
      addRecentFont(fontObj);
      pushUpdate({ font: newFont }, true);
      fontFamilyRef.current = newFont.family;
    },
    [
      fonts,
      maybeEnqueueFontStyle,
      selectedElements,
      addRecentFont,
      pushUpdate,
      fontStyle,
      fontWeight,
    ]
  );

  const handleFontWeightPickerChange = useCallback(
    async (value) => {
      await maybeEnqueueFontStyle(
        selectedElements.map(({ font, content }) => {
          return {
            font,
            fontStyle,
            fontWeight: parseInt(value),
            content: stripHTML(content),
          };
        })
      );
      handleSelectFontWeight(value);
      fontWeightRef.current = value;
    },
    [fontStyle, handleSelectFontWeight, maybeEnqueueFontStyle, selectedElements]
  );

  usePresubmitHandler(
    ({ fontSize: newFontSize }) => ({
      fontSize: clamp(newFontSize, MIN_MAX.FONT_SIZE),
    }),
    []
  );

  const visibleFontWeightSelectedValue = useMemo(() => {
    if (fontFamily !== fontFamilyRef.current) {
      return fontWeight;
    }
    if (MULTIPLE_VALUE === fontWeight) {
      if (fontWeights.length <= 1) {
        return fontWeights[0].value;
      }
      return '';
    }
    return fontWeight;
  }, [fontFamily, fontWeight, fontWeights]);

  return (
    <>
      {fonts && (
        <Row>
          <FontPicker
            data-testid="font"
            aria-label={__('Font family', 'web-stories')}
            options={fonts}
            value={MULTIPLE_VALUE === fontFamily ? '' : fontFamily}
            placeholder={MULTIPLE_DISPLAY_VALUE}
            onChange={handleFontPickerChange}
          />
        </Row>
      )}
      <Row>
        {fontWeights && fontFamily && (
          <>
            <DropDown
              data-testid="font.weight"
              aria-label={__('Font weight', 'web-stories')}
              placeholder={MULTIPLE_DISPLAY_VALUE}
              options={fontWeights}
              value={visibleFontWeightSelectedValue}
              onChange={handleFontWeightPickerChange}
            />
            <Space />
          </>
        )}
        <BoxedNumeric
          aria-label={__('Font size', 'web-stories')}
          value={fontSize}
          flexBasis={58}
          textCenter
          onChange={(value) => pushUpdate({ fontSize: value })}
          min={MIN_MAX.FONT_SIZE.MIN}
          max={MIN_MAX.FONT_SIZE.MAX}
        />
      </Row>
    </>
  );
}

FontControls.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default FontControls;
