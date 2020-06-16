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

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Numeric, Row, ToggleButton } from '../../form';
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
} from '../../../icons';
import { getCommonValue } from '../utils';
import { useFont } from '../../../app/font';
import stripHTML from '../../../utils/stripHTML';
import useRichTextFormatting from './useRichTextFormatting';

const BoxedNumeric = styled(Numeric)`
  padding: 6px 6px;
  border-radius: 4px;
`;

const ExpandedNumeric = styled(BoxedNumeric)`
  flex-grow: 1;

  svg {
    color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.3)};
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

  return (
    <>
      <Row>
        <ExpandedNumeric
          aria-label={__('Line-height', 'web-stories')}
          float={true}
          value={lineHeight || 0}
          suffix={<OffsetVertical />}
          onChange={(value) => pushUpdate({ lineHeight: value })}
        />
        <Space />
        <ExpandedNumeric
          aria-label={__('Letter-spacing', 'web-stories')}
          value={letterSpacing}
          suffix={<OffsetHorizontal />}
          symbol="%"
          onChange={handleSetLetterSpacing}
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
