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
import { forwardRef, useCallback, useMemo } from '@web-stories-wp/react';
import PropTypes from 'prop-types';
import { __ } from '@web-stories-wp/i18n';
import { Datalist } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import stripHTML from '../../../../utils/stripHTML';
import { useFont } from '../../../../app/font';
import { MULTIPLE_DISPLAY_VALUE, MULTIPLE_VALUE } from '../../../../constants';
import { getCommonValue } from '../../shared';
import useRichTextFormatting from './useRichTextFormatting';
import getClosestFontWeight from './getClosestFontWeight';

const FontPicker = forwardRef(function FontPicker(
  { selectedElements, pushUpdate, highlightStylesOverride },
  ref
) {
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
    ensureCustomFontsLoaded,
    getFontsBySearch,
  } = useFont(({ actions, state }) => ({
    getFontsBySearch: actions.getFontsBySearch,
    addRecentFont: actions.addRecentFont,
    ensureMenuFontsLoaded: actions.ensureMenuFontsLoaded,
    ensureCustomFontsLoaded: actions.ensureCustomFontsLoaded,
    maybeEnqueueFontStyle: actions.maybeEnqueueFontStyle,
    recentFonts: state.recentFonts,
    curatedFonts: state.curatedFonts,
    fonts: state.fonts,
  }));

  const handleFontPickerChange = useCallback(
    async (newFont) => {
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
      addRecentFont(newFont);
      pushUpdate({ font: newFont }, true);

      const newFontWeight = getClosestFontWeight(400, newFont.weights);
      await handleResetFontWeight(newFontWeight);
    },
    [
      addRecentFont,
      fontStyle,
      fontWeight,
      maybeEnqueueFontStyle,
      pushUpdate,
      selectedElements,
      handleResetFontWeight,
    ]
  );

  const fontMap = useMemo(() => {
    const map = new Map();
    // curatedFonts and recentFonts are subsets of fonts.
    fonts.forEach((f) => {
      map.set(f.id, f);
    });
    return map;
  }, [fonts]);

  const onObserve = useCallback(
    (observedFonts) => {
      if (!observedFonts.length) {
        return;
      }
      ensureMenuFontsLoaded(
        observedFonts.filter(
          (fontName) => fontMap.get(fontName)?.service === 'fonts.google.com'
        )
      );
      ensureCustomFontsLoaded(
        observedFonts.filter(
          (fontName) => fontMap.get(fontName)?.service === 'custom'
        )
      );
    },
    [fontMap, ensureCustomFontsLoaded, ensureMenuFontsLoaded]
  );

  const renderer = useCallback(
    ({ option, ...rest }, _ref) => {
      return (
        <Datalist.Option
          ref={_ref}
          {...rest}
          fontFamily={
            option.service === 'fonts.google.com'
              ? `'${option.name}::MENU'`
              : option.name
          }
        >
          {fontFamily === option.id && (
            <Datalist.Selected aria-label={__('Selected', 'web-stories')} />
          )}
          {option.name}
        </Datalist.Option>
      );
    },
    [fontFamily]
  );

  return (
    <Datalist.DropDown
      ref={ref}
      highlightStylesOverride={highlightStylesOverride}
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
      getOptionsByQuery={getFontsBySearch}
      onChange={handleFontPickerChange}
      onObserve={onObserve}
      renderer={forwardRef(renderer)}
      disabled={!fonts?.length}
      dropDownLabel={__('Font', 'web-stories')}
    />
  );
});

FontPicker.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
  highlightStylesOverride: PropTypes.array,
};

export default FontPicker;
