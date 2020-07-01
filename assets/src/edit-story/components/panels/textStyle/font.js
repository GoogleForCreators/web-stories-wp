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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import { Numeric, Row, DropDown, usePresubmitHandler } from '../../form';
import FontPicker from '../../fontPicker';
import { useFont } from '../../../app/font';
import { getCommonValue } from '../utils';
import objectPick from '../../../utils/objectPick';
import stripHTML from '../../../utils/stripHTML';
import clamp from '../../../utils/clamp';
import useRichTextFormatting from './useRichTextFormatting';
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
    state: { fonts },
    actions: { maybeEnqueueFontStyle, getFontByName },
  } = useFont();
  const fontWeights = useMemo(() => getFontWeights(getFontByName(fontFamily)), [
    getFontByName,
    fontFamily,
  ]);
  const fontStyle = isItalic ? 'italic' : 'normal';

  const hasNewFontPicker = useFeature('newFontPicker');

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

      pushUpdate({ font: newFont }, true);
    },
    [
      fontStyle,
      fontWeight,
      fonts,
      maybeEnqueueFontStyle,
      pushUpdate,
      selectedElements,
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
    },
    [fontStyle, handleSelectFontWeight, maybeEnqueueFontStyle, selectedElements]
  );

  const FontPickerDropdown = hasNewFontPicker ? FontPicker : DropDown;

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
          <FontPickerDropdown
            data-testid="font"
            aria-label={__('Font family', 'web-stories')}
            options={fonts}
            value={fontFamily}
            onChange={handleFontPickerChange}
          />
        </Row>
      )}
      <Row>
        {fontWeights && (
          <>
            <DropDown
              data-testid="font.weight"
              aria-label={__('Font weight', 'web-stories')}
              placeholder={__('(multiple)', 'web-stories')}
              options={fontWeights}
              value={fontWeight}
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
