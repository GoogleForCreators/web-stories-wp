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
import objectPick from '../../../../utils/objectPick';
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

  const fontMap = useMemo(() => {
    const map = new Map();
    // curatedFonts and recentFonts are subsets of fonts.
    fonts.forEach((f) => {
      map.set(f.id, f);
    });
    return map;
  }, [fonts]);

  const onObserve = (observedFonts) => {
    ensureMenuFontsLoaded(
      observedFonts.filter(
        (fontName) => fontMap.get(fontName)?.service === 'fonts.google.com'
      )
    );
  };

  const renderer = ({ option, ...rest }, _ref) => {
    return (
      <Datalist.Option
        ref={_ref}
        {...rest}
        fontFamily={
          option.service.includes('google')
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
  };

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
