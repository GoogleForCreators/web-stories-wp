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
import { rgba } from 'polished';
import { useCallback } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
  OffsetVertical,
  OffsetHorizontal,
  AlignLeftAlt,
  AlignCenterAlt,
  AlignMiddleAlt,
  AlignRightAlt,
  Bold,
  Italic,
  Underline,
} from '../../../../icons';
import { useFont } from '../../../../app/font';
import stripHTML from '../../../../utils/stripHTML';
import clamp from '../../../../utils/clamp';
import { Numeric, Row, ToggleButton, usePresubmitHandler } from '../../../form';
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

const BoxedNumeric = styled(Numeric)`
  padding: 6px 6px;
  border-radius: 4px;
`;

const ExpandedNumeric = styled(BoxedNumeric)`
  flex-grow: 1;

  svg {
    color: ${({ theme }) => rgba(theme.colors.fg.white, 0.3)};
    width: 16px;
    height: 16px;
  }
`;

const Space = styled.div`
  flex: 0 0 10px;
`;

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
    (value) => handleSetLetterSpacing(clamp(value, MIN_MAX.LETTER_SPACING)),
    [handleSetLetterSpacing]
  );

  usePresubmitHandler(({ lineHeight: newLineHeight }) => {
    return {
      lineHeight: clamp(newLineHeight, MIN_MAX.LINE_HEIGHT),
    };
  }, []);

  return (
    <>
      <Row>
        <ExpandedNumeric
          aria-label={__('Line-height', 'web-stories')}
          float={true}
          value={lineHeight}
          min={MIN_MAX.LINE_HEIGHT.MIN}
          max={MIN_MAX.LINE_HEIGHT.MAX}
          suffix={<OffsetVertical />}
          onChange={(value) => pushUpdate({ lineHeight: value })}
          canBeEmpty
        />
        <Space />
        <ExpandedNumeric
          aria-label={__('Letter-spacing', 'web-stories')}
          value={letterSpacing}
          min={MIN_MAX.LETTER_SPACING.MIN}
          max={MIN_MAX.LETTER_SPACING.MAX}
          suffix={<OffsetHorizontal />}
          symbol="%"
          onChange={setLetterSpacingMinMax}
          canBeEmpty
        />
      </Row>
      <Row>
        <ToggleButton
          icon={<AlignLeftAlt />}
          value={textAlign === 'left'}
          onChange={(value) =>
            pushUpdate({ textAlign: value ? 'left' : '' }, true)
          }
          aria-label={__('Align: left', 'web-stories')}
        />
        <ToggleButton
          icon={<AlignCenterAlt />}
          value={textAlign === 'center'}
          onChange={(value) =>
            pushUpdate({ textAlign: value ? 'center' : '' }, true)
          }
          aria-label={__('Align: center', 'web-stories')}
        />
        <ToggleButton
          icon={<AlignRightAlt />}
          value={textAlign === 'right'}
          onChange={(value) =>
            pushUpdate({ textAlign: value ? 'right' : '' }, true)
          }
          aria-label={__('Align: right', 'web-stories')}
        />
        <ToggleButton
          icon={<AlignMiddleAlt />}
          value={textAlign === 'justify'}
          onChange={(value) =>
            pushUpdate({ textAlign: value ? 'justify' : '' }, true)
          }
          aria-label={__('Align: justify', 'web-stories')}
        />
        <ToggleButton
          data-testid="boldToggle"
          icon={<Bold />}
          value={isBold}
          iconWidth={9}
          iconHeight={10}
          onChange={handleClickBold}
          aria-label={__('Toggle: bold', 'web-stories')}
        />
        <ToggleButton
          icon={<Italic />}
          value={isItalic}
          iconWidth={10}
          iconHeight={10}
          onChange={async (value) => {
            await maybeEnqueueFontStyle(
              selectedElements.map(({ font, content }) => {
                return {
                  font,
                  fontStyle: value ? 'italic' : 'normal',
                  fontWeight,
                  content: stripHTML(content),
                };
              })
            );
            handleClickItalic(value);
          }}
          aria-label={__('Toggle: italic', 'web-stories')}
        />
        <ToggleButton
          icon={<Underline />}
          value={isUnderline}
          iconWidth={8}
          iconHeight={21}
          onChange={handleClickUnderline}
          aria-label={__('Toggle: underline', 'web-stories')}
        />
      </Row>
    </>
  );
}

StylePanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default StylePanel;
