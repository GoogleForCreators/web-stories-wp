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

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { InputGroup, SelectMenu } from '../../form';
import { PAGE_HEIGHT } from '../../../constants';
import { useFont } from '../../../app/font';

function FontControls({ properties, state, setState }) {
  const { fontFamily, fontWeight, fontSize } = properties;
  const {
    state: { fonts },
    actions: { getFontWeight, getFontFallback },
  } = useFont();

  const handleNumberChange = useCallback(
    (property) => (value) =>
      setState({ ...state, [property]: parseInt(value) }),
    [setState, state]
  );
  return (
    <>
      {fonts && (
        <SelectMenu
          label={__('Font family', 'web-stories')}
          options={fonts}
          value={state.fontFamily}
          isMultiple={fontFamily === ''}
          onChange={(value) => {
            const currentFontWeights = getFontWeight(value);
            const currentFontFallback = getFontFallback(value);
            const fontWeightsArr = currentFontWeights.map(
              ({ value: weight }) => weight
            );
            let newFontWeight =
              fontWeightsArr &&
              fontWeightsArr.includes(state.fontWeight.toString())
                ? state.fontWeight
                : 400;

            // If the font doesn't have 400 as an option, let's take the first available option.
            if (!newFontWeight && fontWeightsArr.length) {
              newFontWeight = fontWeightsArr[0];
            }
            setState({
              ...state,
              fontFamily: value,
              fontWeight: parseInt(newFontWeight),
              fontWeights: currentFontWeights,
              fontFallback: currentFontFallback,
            });
          }}
        />
      )}
      {state.fontWeights && (
        <SelectMenu
          label={__('Font weight', 'web-stories')}
          options={state.fontWeights}
          value={state.fontWeight}
          isMultiple={fontWeight === ''}
          onChange={handleNumberChange('fontWeight')}
        />
      )}
      <InputGroup
        type="number"
        label={__('Font size', 'web-stories')}
        value={state.fontSize}
        isMultiple={fontSize === ''}
        postfix={'px'}
        max={PAGE_HEIGHT}
        onChange={handleNumberChange('fontSize')}
      />
    </>
  );
}

FontControls.propTypes = {
  properties: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
};

export default FontControls;
