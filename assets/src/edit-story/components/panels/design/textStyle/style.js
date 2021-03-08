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
import styled from 'styled-components';
import { useCallback } from 'react';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import {
  NumericInput,
  Icons,
  ToggleButton,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
} from '../../../../../design-system';
import { useFont } from '../../../../app/font';
import stripHTML from '../../../../utils/stripHTML';
import clamp from '../../../../utils/clamp';
import { Row, usePresubmitHandler } from '../../../form';
import { MULTIPLE_VALUE, MULTIPLE_DISPLAY_VALUE } from '../../../../constants';
import { getCommonValue } from '../../shared';
import useRichTextFormatting from './useRichTextFormatting';

const MIN_MAX = {
  LINE_HEIGHT: {
    MIN: 0.5,
    MAX: 10,
  },
  LETTER_SPACING: {
    MIN: 0,
    MAX: 300,
  },
};

const StyledNumericInput = styled(NumericInput)`
  flex-grow: 1;
`;

const Space = styled.div`
  flex: 0 0 10px;
`;

function Toggle(props) {
  return (
    <ToggleButton
      size={BUTTON_SIZES.SMALL}
      variant={BUTTON_VARIANTS.SQUARE}
      {...props}
    />
  );
}

function StylePanel({ selectedElements, pushUpdate }) {
  const {
    actions: { maybeEnqueueFontStyle },
  } = useFont();
  const textAlign = getCommonValue(selectedElements, 'textAlign');
  const lineHeight = getCommonValue(selectedElements, 'lineHeight');

  const {
    textInfo: { isBold, isItalic, isUnderline, letterSpacing, fontWeight },
    handlers: {
      handleClickBold,
      handleClickItalic,
      handleClickUnderline,
      handleSetLetterSpacing,
    },
  } = useRichTextFormatting(selectedElements, pushUpdate);

  const setLetterSpacingMinMax = useCallback(
    (evt, value) =>
      handleSetLetterSpacing(clamp(value, MIN_MAX.LETTER_SPACING)),
    [handleSetLetterSpacing]
  );

  usePresubmitHandler(({ lineHeight: newLineHeight }) => {
    return {
      lineHeight: clamp(newLineHeight, MIN_MAX.LINE_HEIGHT),
    };
  }, []);

  const handleTextAlign = useCallback(
    (alignment) => () => {
      pushUpdate({ textAlign: textAlign === alignment ? '' : alignment }, true);
    },
    [pushUpdate, textAlign]
  );

  return (
    <>
      <Row>
        <StyledNumericInput
          aria-label={__('Line-height', 'web-stories')}
          isFloat
          value={lineHeight}
          min={MIN_MAX.LINE_HEIGHT.MIN}
          max={MIN_MAX.LINE_HEIGHT.MAX}
          suffix={<Icons.LetterAHeight />}
          onChange={(evt, value) => pushUpdate({ lineHeight: value }, true)}
          allowEmpty
          isIndeterminate={MULTIPLE_VALUE === lineHeight}
          placeholder={
            MULTIPLE_VALUE === lineHeight ? MULTIPLE_DISPLAY_VALUE : null
          }
        />
        <Space />
        <StyledNumericInput
          aria-label={__('Letter-spacing', 'web-stories')}
          value={letterSpacing}
          min={MIN_MAX.LETTER_SPACING.MIN}
          max={MIN_MAX.LETTER_SPACING.MAX}
          suffix={<Icons.LetterAWidth />}
          unit="%"
          onChange={setLetterSpacingMinMax}
          allowEmpty
          isIndeterminate={MULTIPLE_VALUE === letterSpacing}
          placeholder={
            MULTIPLE_VALUE === letterSpacing ? MULTIPLE_DISPLAY_VALUE : null
          }
        />
      </Row>
      <Row>
        <Toggle
          isToggled={textAlign === 'left'}
          onClick={handleTextAlign('left')}
          aria-label={__('Align: left', 'web-stories')}
        >
          <Icons.AlignTextLeft />
        </Toggle>
        <Toggle
          isToggled={textAlign === 'center'}
          onClick={handleTextAlign('center')}
          aria-label={__('Align: center', 'web-stories')}
        >
          <Icons.AlignTextCenter />
        </Toggle>
        <Toggle
          isToggled={textAlign === 'right'}
          onClick={handleTextAlign('right')}
          aria-label={__('Align: right', 'web-stories')}
        >
          <Icons.AlignTextRight />
        </Toggle>
        <Toggle
          isToggled={textAlign === 'justify'}
          onClick={handleTextAlign('justify')}
          aria-label={__('Align: justify', 'web-stories')}
        >
          <Icons.AlignTextJustified />
        </Toggle>
        <Toggle
          isToggled={isBold}
          onClick={() => handleClickBold(!isBold)}
          aria-label={__('Toggle: bold', 'web-stories')}
        >
          <Icons.LetterBBold />
        </Toggle>
        <Toggle
          isToggled={isItalic}
          onClick={async () => {
            await maybeEnqueueFontStyle(
              selectedElements.map(({ font, content }) => {
                return {
                  font,
                  fontStyle: isItalic ? 'normal' : 'italic',
                  fontWeight,
                  content: stripHTML(content),
                };
              })
            );
            handleClickItalic(!isItalic);
          }}
          aria-label={__('Toggle: italic', 'web-stories')}
        >
          <Icons.LetterIItalic />
        </Toggle>
        <Toggle
          isToggled={isUnderline}
          onClick={() => handleClickUnderline(!isUnderline)}
          aria-label={__('Toggle: underline', 'web-stories')}
        >
          <Icons.LetterUUnderline />
        </Toggle>
      </Row>
    </>
  );
}

StylePanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default StylePanel;
