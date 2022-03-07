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
import { useMemo, useCallback } from '@googleforcreators/react';
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';
import { DropDown, NumericInput } from '@googleforcreators/design-system';
import { stripHTML } from '@googleforcreators/dom';
import { clamp } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import { useFont } from '../../../../app/font';
import { MULTIPLE_VALUE, MULTIPLE_DISPLAY_VALUE } from '../../../../constants';
import { Row, usePresubmitHandler } from '../../../form';
import {
  focusStyle,
  getCommonValue,
  inputContainerStyleOverride,
} from '../../shared';
import useRichTextFormatting from './useRichTextFormatting';
import getFontWeights from './getFontWeights';
import FontPicker from './fontPicker';

export const MIN_MAX = {
  FONT_SIZE: {
    MIN: 8,
    MAX: 800,
  },
};

const Space = styled.div`
  flex: 0 0 10px;
`;

const StyledNumericInput = styled(NumericInput)`
  flex-basis: 80px;
  text-align: center;
`;

const StyledDropDown = styled(DropDown)`
  background-color: transparent;
`;

function FontControls({
  selectedElements,
  pushUpdate,
  fontDropdownRef,
  highlightStylesOverride,
}) {
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
    fonts = [],
    maybeEnqueueFontStyle,
    getFontByName,
  } = useFont(
    ({
      actions: { maybeEnqueueFontStyle, getFontByName },
      state: { fonts },
    }) => ({
      maybeEnqueueFontStyle,
      getFontByName,
      fonts,
    })
  );

  const fontWeights = useMemo(
    () => getFontWeights(getFontByName(fontFamily)),
    [getFontByName, fontFamily]
  );
  const fontStyle = isItalic ? 'italic' : 'normal';

  const handleFontWeightPickerChange = useCallback(
    async (evt, value) => {
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
    },
    [fontStyle, handleSelectFontWeight, maybeEnqueueFontStyle, selectedElements]
  );

  usePresubmitHandler(
    ({ fontSize: newFontSize }) => ({
      fontSize: clamp(newFontSize, MIN_MAX.FONT_SIZE),
    }),
    []
  );

  return (
    <>
      {fonts && (
        <Row>
          <FontPicker
            ref={fontDropdownRef}
            selectedElements={selectedElements}
            pushUpdate={pushUpdate}
            highlightStylesOverride={highlightStylesOverride}
          />
        </Row>
      )}
      <Row>
        {fontWeights && (
          <>
            <StyledDropDown
              ariaLabel={__('Font weight', 'web-stories')}
              placeholder={MULTIPLE_DISPLAY_VALUE}
              options={fontWeights}
              selectedValue={MULTIPLE_VALUE === fontWeight ? '' : fontWeight}
              onMenuItemClick={handleFontWeightPickerChange}
              selectButtonStylesOverride={focusStyle}
            />
            <Space />
          </>
        )}
        <StyledNumericInput
          aria-label={__('Font size', 'web-stories')}
          isFloat
          value={fontSize}
          onChange={(evt, value) => pushUpdate({ fontSize: value }, true)}
          min={MIN_MAX.FONT_SIZE.MIN}
          max={MIN_MAX.FONT_SIZE.MAX}
          isIndeterminate={MULTIPLE_VALUE === fontSize}
          placeholder={
            MULTIPLE_VALUE === fontSize ? MULTIPLE_DISPLAY_VALUE : null
          }
          containerStyleOverride={inputContainerStyleOverride}
        />
      </Row>
    </>
  );
}

FontControls.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
  fontDropdownRef: PropTypes.func,
  highlightStylesOverride: PropTypes.array,
};

export default FontControls;
