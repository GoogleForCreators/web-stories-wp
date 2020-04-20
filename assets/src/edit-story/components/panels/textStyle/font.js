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
import { Numeric, Row, DropDown } from '../../form';
import { PAGE_HEIGHT } from '../../../constants';
import { useFont } from '../../../app/font';
import { getCommonValue } from '../utils';

const Space = styled.div`
  flex: 0 0 10px;
`;

const BoxedNumeric = styled(Numeric)`
  padding: 6px 6px;
  border-radius: 4px;
`;

function FontControls({ selectedElements, pushUpdate }) {
  const fontFamily = getCommonValue(selectedElements, 'fontFamily');
  const fontSize = getCommonValue(selectedElements, 'fontSize');
  const fontWeight = getCommonValue(selectedElements, 'fontWeight');
  const timeout = useRef(null);

  const {
    state: { fonts },
    actions: { maybeEnqueueFontStyle, getFontWeight, getFontFallback },
  } = useFont();
  const fontWeights = useMemo(() => getFontWeight(fontFamily), [
    getFontWeight,
    fontFamily,
  ]);

  const loadFont = useCallback(
    (family, callback) => {
      // 0. Check browser support to load fonts using JavaScript
      if (document?.fonts) {
        const font = `0 ${family}`;

        // 1. Check if font family was not loaded yet
        if (!document.fonts.check(font)) {
          // 2. Try to inject <link /> resource of the font family
          maybeEnqueueFontStyle(family);
          // 3. Schedule a re-check since we need to wait the <link /> injection
          timeout.current = setTimeout(async () => {
            // 4. Load the new injected font in the client
            await document.fonts.load(font);
            // 5. Re-check if font was loaded
            if (document.fonts.check(font)) {
              return callback();
            }
            // 6. Try again if font still is not loaded
            return loadFont(family, callback);
          });
        }
      }

      return callback();
    },
    [maybeEnqueueFontStyle]
  );

  useEffect(
    () => () => {
      clearTimeout(timeout.current);
    },
    [timeout]
  );

  return (
    <>
      {fonts && (
        <Row>
          <DropDown
            data-testid="font"
            ariaLabel={__('Font family', 'web-stories')}
            options={fonts}
            value={fontFamily}
            onChange={(value) => {
              loadFont(value, () => {
                const currentFontWeights = getFontWeight(value);
                const currentFontFallback = getFontFallback(value);
                const fontWeightsArr = currentFontWeights.map(
                  ({ value: weight }) => weight
                );
                // Find the nearest font weight from the available font weight list
                // If no fontweightsArr available then will return undefined
                const newFontWeight =
                  fontWeightsArr &&
                  fontWeightsArr.reduce((a, b) =>
                    Math.abs(parseInt(b) - fontWeight) <
                    Math.abs(parseInt(a) - fontWeight)
                      ? b
                      : a
                  );
                pushUpdate(
                  {
                    fontFamily: value,
                    fontWeight: parseInt(newFontWeight),
                    fontFallback: currentFontFallback,
                  },
                  true
                );
              });
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
              options={fontWeights}
              value={fontWeight}
              onChange={(value) =>
                pushUpdate({ fontWeight: parseInt(value) }, true)
              }
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
