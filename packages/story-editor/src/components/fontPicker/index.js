/*
 * Copyright 2022 Google LLC
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
import {
  forwardRef,
  useCallback,
  useMemo,
  useEffect,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';
import { __ } from '@googleforcreators/i18n';
import {
  DatalistDropdown,
  DatalistOption,
  DatalistSelected,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useFont } from '../../app';
import { MULTIPLE_DISPLAY_VALUE, MULTIPLE_VALUE } from '../../constants';

const FontPicker = forwardRef(function FontPicker(
  {
    zIndex,
    onChange,
    currentValue,
    highlightStylesOverride,
    showDropdownLabel,
    listStyleOverrides,
    containerStyleOverrides,
    className,
    tabIndex,
  },
  ref
) {
  const {
    fonts = [],
    recentFonts = [],
    curatedFonts = [],
    customFonts = [],
    ensureMenuFontsLoaded,
    ensureCustomFontsLoaded,
    getFontsBySearch,
    loadCustomFonts,
    loadCuratedFonts,
  } = useFont(({ actions, state }) => ({
    getFontsBySearch: actions.getFontsBySearch,
    ensureMenuFontsLoaded: actions.ensureMenuFontsLoaded,
    ensureCustomFontsLoaded: actions.ensureCustomFontsLoaded,
    loadCuratedFonts: actions.loadCuratedFonts,
    loadCustomFonts: actions.loadCustomFonts,
    recentFonts: state.recentFonts,
    curatedFonts: state.curatedFonts,
    fonts: state.fonts,
    customFonts: state.customFonts,
  }));

  useEffect(() => {
    loadCustomFonts();
    loadCuratedFonts();
  }, [loadCustomFonts, loadCuratedFonts]);

  const fontMap = useMemo(() => {
    const map = new Map();
    // curatedFonts and recentFonts are subsets of fonts.
    fonts.forEach((f) => {
      map.set(f.id, f);
    });

    customFonts?.forEach((f) => {
      map.set(f.id, f);
    });

    return map;
  }, [fonts, customFonts]);

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
        <DatalistOption
          ref={_ref}
          {...rest}
          fontFamily={
            option.service === 'fonts.google.com'
              ? `'${option.name}::MENU'`
              : option.name
          }
        >
          {currentValue === option.id && (
            <DatalistSelected aria-label={__('Selected', 'web-stories')} />
          )}
          {option.name}
        </DatalistOption>
      );
    },
    [currentValue]
  );

  // These option groups will always be shown before others.
  const priorityOptionGroups = useMemo(() => {
    return [
      ...(customFonts?.length
        ? [
            {
              label: __('Your fonts', 'web-stories'),
              options: customFonts,
            },
          ]
        : []),
      ...(recentFonts?.length
        ? [
            {
              label: __('Recently used', 'web-stories'),
              options: recentFonts,
            },
          ]
        : []),
    ];
  }, [customFonts, recentFonts]);

  //console.error('What is datalist?', DatalistDropdown, DatalistOption);
  //return null;

  return (
    <DatalistDropdown
      ref={ref}
      zIndex={zIndex}
      tabIndex={tabIndex}
      highlightStylesOverride={highlightStylesOverride}
      data-testid="font"
      title={__('Available font families', 'web-stories')}
      dropdownButtonLabel={__('Font family', 'web-stories')}
      options={fonts}
      primaryOptions={curatedFonts}
      primaryLabel={__('Recommended', 'web-stories')}
      priorityOptionGroups={priorityOptionGroups}
      searchResultsLabel={__('Search results', 'web-stories')}
      selectedId={MULTIPLE_VALUE === currentValue ? '' : currentValue}
      placeholder={
        MULTIPLE_VALUE === currentValue ? MULTIPLE_DISPLAY_VALUE : currentValue
      }
      hasSearch
      getOptionsByQuery={getFontsBySearch}
      onChange={onChange}
      onObserve={onObserve}
      renderer={forwardRef(renderer)}
      disabled={!fonts?.length}
      dropDownLabel={showDropdownLabel ? __('Font', 'web-stories') : null}
      listStyleOverrides={listStyleOverrides}
      containerStyleOverrides={containerStyleOverrides}
      className={className}
    />
  );
});

FontPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  currentValue: PropTypes.string.isRequired,
  highlightStylesOverride: PropTypes.array,
  showDropdownLabel: PropTypes.bool,
  listStyleOverrides: PropTypes.array,
  containerStyleOverrides: PropTypes.array,
  zIndex: PropTypes.number,
  tabIndex: PropTypes.number,
};

export default FontPicker;
