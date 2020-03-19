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
import { useCallback, useEffect, useState } from 'react';
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
import getCommonValue from '../utils/getCommonValue';

const Space = styled.div`
  flex: 0 0 10px;
`;

const BoxedNumeric = styled(Numeric)`
  padding: 6px 6px;
  border-radius: 4px;
`;

function FontControls({ selectedElements, onSetProperties }) {
  const fontFamily = getCommonValue(selectedElements, 'fontFamily');
  const fontSize = getCommonValue(selectedElements, 'fontSize');
  const fontWeight = getCommonValue(selectedElements, 'fontWeight');
  const fontWeights = getCommonValue(selectedElements, 'fontWeights');
  const fontFallback = getCommonValue(selectedElements, 'fontFallback');
  const {
    state: { fonts },
    actions: { getFontWeight, getFontFallback },
  } = useFont();

  const [state, setState] = useState({
    fontFamily,
    fontSize,
    fontWeight,
    fontFallback,
    fontWeights,
  });

  useEffect(() => {
    const currentFontWeights = getFontWeight(fontFamily);
    const currentFontFallback = getFontFallback(fontFamily);
    setState({
      fontFamily,
      fontSize,
      fontWeight,
      fontWeights: currentFontWeights,
      fontFallback: currentFontFallback,
    });
  }, [getFontWeight, fontFamily, getFontFallback, fontSize, fontWeight]);

  const updateProperties = useCallback(() => {
    onSetProperties(state);
  }, [onSetProperties, state]);

  useEffect(() => {
    updateProperties();
  }, [state.fontFamily, state.fontSize, state.fontWeight, updateProperties]);

  const handleNumberChange = useCallback(
    (property) => (value) =>
      setState({ ...state, [property]: parseInt(value) }),
    [setState, state]
  );
  return (
    <>
      {fonts && (
        <Row>
          <DropDown
            ariaLabel={__('Font family', 'web-stories')}
            options={fonts}
            value={state.fontFamily}
            onChange={(value) => {
              const currentFontWeights = getFontWeight(value);
              const currentFontFallback = getFontFallback(value);
              const fontWeightsArr = currentFontWeights.map(
                ({ value: weight }) => weight
              );

              // The default weight is 400 or empty if there are none available.
              let defaultWeight = fontWeightsArr?.length ? 400 : '';
              // If the font doesn't have 400 as an option, let's take the first available option.
              if (
                fontWeightsArr?.length &&
                !fontWeightsArr.includes(defaultWeight.toString())
              ) {
                defaultWeight = fontWeightsArr[0];
              }
              const newFontWeight =
                fontWeightsArr &&
                fontWeightsArr.includes(state.fontWeight.toString())
                  ? state.fontWeight
                  : defaultWeight;

              setState({
                ...state,
                fontFamily: value,
                fontWeight: parseInt(newFontWeight),
                fontWeights: currentFontWeights,
                fontFallback: currentFontFallback,
              });
            }}
          />
        </Row>
      )}
      <Row>
        {state.fontWeights && (
          <>
            <DropDown
              ariaLabel={__('Font weight', 'web-stories')}
              options={state.fontWeights}
              value={state.fontWeight}
              onChange={handleNumberChange('fontWeight')}
            />
            <Space />
          </>
        )}
        <BoxedNumeric
          ariaLabel={__('Font size', 'web-stories')}
          value={state.fontSize}
          isMultiple={fontSize === ''}
          max={PAGE_HEIGHT}
          flexBasis={58}
          textCenter
          onChange={handleNumberChange('fontSize')}
        />
      </Row>
    </>
  );
}

FontControls.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default FontControls;
