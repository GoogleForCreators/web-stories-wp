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
import { forwardRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import objectPick from '../../../../utils/objectPick';
import stripHTML from '../../../../utils/stripHTML';
import { useFont } from '../../../../app/font';
import {
  AdvancedDropDown,
  MULTIPLE_DISPLAY_VALUE,
  MULTIPLE_VALUE,
} from '../../../form';
import { Option, Selected } from '../../../form/advancedDropDown/list/styled';
import { getCommonValue } from '../../shared';
import useRichTextFormatting from './useRichTextFormatting';
import getClosestFontWeight from './getClosestFontWeight';

function FontPicker({ selectedElements, pushUpdate }) {
  const fontFamily = getCommonValue(
    selectedElements,
    ({ font }) => font?.family
  );

  const {
    textInfo: { fontWeight, isItalic },
    handlers: { handleResetFontWeight },
  } = useRichTextFormatting(selectedElements, pushUpdate);
  const fontStyle = isItalic ? 'italic' : 'normal';

  const {
    fonts = [],
    recentFonts = [],
    curatedFonts = [],
    addRecentFont,
    maybeEnqueueFontStyle,
    ensureMenuFontsLoaded,
  } = useFont(
    ({
      actions: { addRecentFont, ensureMenuFontsLoaded, maybeEnqueueFontStyle },
      state: { fonts, recentFonts, curatedFonts },
    }) => ({
      addRecentFont,
      ensureMenuFontsLoaded,
      maybeEnqueueFontStyle,
      recentFonts,
      curatedFonts,
      fonts,
    })
  );

  const handleFontPickerChange = useCallback(
    async ({ id }) => {
      const fontObj = fonts.find((item) => item.value === id);
      const newFont = {
        family: id,
        ...objectPick(fontObj, [
          'service',
          'fallbacks',
          'weights',
          'styles',
          'variants',
          'metrics',
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
      addRecentFont(fontObj);
      pushUpdate({ font: newFont }, true);

      const newFontWeight = getClosestFontWeight(400, fontObj.weights);
      await handleResetFontWeight(newFontWeight);
    },
    [
      addRecentFont,
      fontStyle,
      fontWeight,
      fonts,
      maybeEnqueueFontStyle,
      pushUpdate,
      selectedElements,
      handleResetFontWeight,
    ]
  );

  const fontMap = useMemo(
    () =>
      [...fonts, ...recentFonts, ...curatedFonts].reduce(
        (lookup, option) => ({
          ...lookup,
          [option.id]: option,
        }),
        {}
      ),
    [fonts, recentFonts, curatedFonts]
  );

  const onObserve = (observedFonts) => {
    ensureMenuFontsLoaded(
      observedFonts.filter(
        (fontName) => fontMap[fontName]?.service === 'fonts.google.com'
      )
    );
  };

  const renderer = ({ option, ...rest }, ref) => {
    return (
      <Option
        ref={ref}
        {...rest}
        fontFamily={
          option.service.includes('google')
            ? `'${option.name}::MENU'`
            : option.name
        }
      >
        {fontFamily === option.id && (
          <Selected aria-label={__('Selected', 'web-stories')} />
        )}
        {option.name}
      </Option>
    );
  };

  return (
    <AdvancedDropDown
      data-testid="font"
      aria-label={__('Font family', 'web-stories')}
      options={fonts}
      primaryOptions={curatedFonts}
      primaryLabel={__('Recommended', 'web-stories')}
      priorityOptions={recentFonts}
      priorityLabel={__('Recently used', 'web-stories')}
      searchResultsLabel={__('Search results', 'web-stories')}
      selectedId={MULTIPLE_VALUE === fontFamily ? '' : fontFamily}
      placeholder={
        MULTIPLE_VALUE === fontFamily ? MULTIPLE_DISPLAY_VALUE : fontFamily
      }
      hasSearch
      onChange={handleFontPickerChange}
      onObserve={onObserve}
      renderer={forwardRef(renderer)}
      disabled={!fonts?.length}
    />
  );
}

FontPicker.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default FontPicker;
