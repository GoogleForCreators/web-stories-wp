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
import { useMemo } from 'react';
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Numeric, Row, DropDown } from '../../form';
import { PAGE_HEIGHT } from '../../../constants';
import { useFont } from '../../../app/font';
import { getCommonValue } from '../utils';
import objectPick from '../../../utils/objectPick';
import stripHTML from '../../../utils/stripHTML';
import useRichTextFormatting from './useRichTextFormatting';
import getFontWeights from './getFontWeights';

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

  return (
    <>
      {fonts && (
        <Row>
          <DropDown
            data-testid="font"
            ariaLabel={__('Font family', 'web-stories')}
            options={fonts}
            value={fontFamily}
            onChange={async (value) => {
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

              pushUpdate(
                {
                  font: newFont,
                },
                true
              );
            }}
          />
        </Row>
      )}
      <Row>
        {fontWeights && (
          <>
            <DropDown
              data-testid="font.weight"
              ariaLabel={__('Font weight', 'web-stories')}
              placeholder={__('(multiple)', 'web-stories')}
              options={fontWeights}
              value={fontWeight}
              onChange={async (value) => {
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
              }}
            />
            <Space />
          </>
        )}
        <BoxedNumeric
          data-testid="font.size"
          ariaLabel={__('Font size', 'web-stories')}
          value={fontSize}
          max={PAGE_HEIGHT}
          flexBasis={58}
          textCenter
          onChange={(value) => pushUpdate({ fontSize: value })}
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
