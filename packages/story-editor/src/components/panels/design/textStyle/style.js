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
import { useCallback } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import {
  NumericInput,
  Icons,
  ToggleButton,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
} from '@googleforcreators/design-system';
import { stripHTML } from '@googleforcreators/dom';
import { clamp } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import { useFont } from '../../../../app/font';
import { Row, usePresubmitHandler } from '../../../form';
import {
  focusStyle,
  getCommonValue,
  inputContainerStyleOverride,
} from '../../shared';
import { MULTIPLE_VALUE, MULTIPLE_DISPLAY_VALUE } from '../../../../constants';
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
  flex: 0 0 3px;
`;

const StyledToggle = styled(ToggleButton)`
  ${focusStyle};
`;

function Toggle(props) {
  return (
    <StyledToggle
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
    textInfo: {
      isBold,
      isItalic,
      isUnderline,
      isUppercase,
      letterSpacing,
      fontWeight,
    },
    handlers: {
      handleClickBold,
      handleClickItalic,
      handleClickUnderline,
      handleClickUppercase,
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

  // We need to weed out the chance, that either of these are MULTIPLE_VALUE.
  // If not strictly true, treat as false in every way.
  const isTrulyBold = isBold === true;
  const isTrulyItalic = isItalic === true;
  const isTrulyUnderline = isUnderline === true;
  const isTrulyUppercase = isUppercase === true;

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
          containerStyleOverride={inputContainerStyleOverride}
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
          containerStyleOverride={inputContainerStyleOverride}
        />
      </Row>
      <Row>
        <Toggle
          isToggled={textAlign === 'left'}
          onClick={handleTextAlign('left')}
          aria-label={__('Align text left', 'web-stories')}
        >
          <Icons.AlignTextLeft />
        </Toggle>
        <Toggle
          isToggled={textAlign === 'center'}
          onClick={handleTextAlign('center')}
          aria-label={__('Align text center', 'web-stories')}
        >
          <Icons.AlignTextCenter />
        </Toggle>
        <Toggle
          isToggled={textAlign === 'right'}
          onClick={handleTextAlign('right')}
          aria-label={__('Align text right', 'web-stories')}
        >
          <Icons.AlignTextRight />
        </Toggle>
        <Toggle
          isToggled={textAlign === 'justify'}
          onClick={handleTextAlign('justify')}
          aria-label={__('Align text justified', 'web-stories')}
        >
          <Icons.AlignTextJustified />
        </Toggle>
        <Toggle
          isToggled={isTrulyBold}
          onClick={() => handleClickBold(!isTrulyBold)}
          aria-label={__('Bold', 'web-stories')}
        >
          <Icons.LetterBBold />
        </Toggle>
        <Toggle
          isToggled={isTrulyItalic}
          onClick={async () => {
            await maybeEnqueueFontStyle(
              selectedElements.map(({ font, content }) => {
                return {
                  font,
                  fontStyle: isTrulyItalic ? 'normal' : 'italic',
                  fontWeight,
                  content: stripHTML(content),
                };
              })
            );
            handleClickItalic(!isTrulyItalic);
          }}
          aria-label={__('Italic', 'web-stories')}
        >
          <Icons.LetterIItalic />
        </Toggle>
        <Toggle
          isToggled={isTrulyUnderline}
          onClick={() => handleClickUnderline(!isTrulyUnderline)}
          aria-label={__('Underline', 'web-stories')}
        >
          <Icons.LetterUUnderline />
        </Toggle>
        <Toggle
          isToggled={isTrulyUppercase}
          onClick={() => handleClickUppercase(!isTrulyUppercase)}
          aria-label={__('Uppercase', 'web-stories')}
        >
          <Icons.LetterTUppercase />
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
