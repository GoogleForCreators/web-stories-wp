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
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useFont } from '../../../app/font';
import useFocusOut from '../../../utils/useFocusOut';
import {
  createFontFilter,
  isKeywordFilterable,
  getOptions,
  addUniqueEntry,
  getInset,
} from './utils';
import { List, Group, GroupLabel, Option, Selected, NoResult } from './styled';

function FontList({
  keyword = '',
  value = '',
  onSelect = () => {},
  onClose = () => {},
  onExpandedChange = () => {},
  focusTrigger = 0,
}) {
  const listRef = useRef(null);
  const optionsRef = useRef([]);
  const [focusIndex, setFocusIndex] = useState(-1);
  const [userSeenFonts, setUserSeenFonts] = useState([]);
  const [
    fonts,
    recentFonts,
    curatedFonts,
    ensureMenuFontsLoaded,
  ] = useFont(({ state, actions }) => [
    state.fonts,
    state.recentFonts,
    state.curatedFonts,
    actions.ensureMenuFontsLoaded,
  ]);
  const fontMap = useMemo(
    () =>
      [...fonts, ...recentFonts, ...curatedFonts].reduce(
        (lookup, font) => ({
          ...lookup,
          [font.name]: font,
        }),
        {}
      ),
    [fonts, recentFonts, curatedFonts]
  );

  /*
   * KEYWORD FILTERING
   */
  const filteredListGroups = useMemo(
    () => [
      {
        label: __('Recently used', 'web-stories'),
        options: createFontFilter(recentFonts)(keyword),
      },
      {
        label: __('Recommended', 'web-stories'),
        options: isKeywordFilterable(keyword)
          ? createFontFilter(fonts)(keyword)
          : curatedFonts,
      },
    ],
    [keyword, fonts, curatedFonts, recentFonts]
  );

  /*
   * LAZY FONT LOADING
   */
  // Add font when observed entry is seen
  const observer = useMemo(
    () =>
      new window.IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setUserSeenFonts(addUniqueEntry(entry.target.dataset.font));
            }
          });
        },
        {
          root: listRef.current,
          // Gets ~2 extra items below scroll container BoundingBox
          rootMargin: '60px',
        }
      ),
    []
  );

  // Observe rendered font options
  useLayoutEffect(() => {
    const renderedOptions = optionsRef.current;
    renderedOptions.forEach((option) => option && observer.observe(option));
    return () => {
      renderedOptions.forEach((option) => option && observer.unobserve(option));
      // clear exisiting option references before next update to filteredGroup
      optionsRef.current = [];
    };
  }, [observer, filteredListGroups]);

  // load all seen fonts from google service
  useEffect(() => {
    ensureMenuFontsLoaded(
      userSeenFonts.filter(
        (fontName) => fontMap[fontName]?.service === 'fonts.google.com'
      )
    );
  }, [ensureMenuFontsLoaded, userSeenFonts, fontMap]);

  /*
   * KEYBOARD ACCESSIBILITY
   */
  const filteredOptions = useMemo(() => getOptions(filteredListGroups), [
    filteredListGroups,
  ]);

  const handleKeyPress = useCallback(
    ({ key }) => {
      if (key === 'Escape') {
        onClose();
      } else if (key === 'Enter') {
        if (filteredOptions[focusIndex]) {
          onSelect(filteredOptions[focusIndex].name);
        }
      } else if (key === 'ArrowUp') {
        setFocusIndex((index) => Math.max(0, index - 1));
      } else if (key === 'ArrowDown') {
        setFocusIndex((index) =>
          Math.min(filteredOptions.length - 1, index + 1)
        );
      }
    },
    [focusIndex, filteredOptions, onClose, onSelect]
  );

  useFocusOut(listRef, () => setFocusIndex(-1), []);

  // scroll into view and focus focusIndex
  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl) {
      return;
    }
    if (focusIndex === -1) {
      listEl.scrollTo(0, 0);
      return;
    }

    const highlighedOptionEl = optionsRef.current[focusIndex];
    if (!highlighedOptionEl) {
      return;
    }

    highlighedOptionEl.focus();
    listEl.scrollTo(0, highlighedOptionEl.offsetTop - listEl.clientHeight / 2);
  }, [focusIndex, filteredOptions, keyword]);

  /*
   * ACCESSIBILITY COMMUNICATION WITH SEARCH INPUT
   */
  const isExpanded = filteredOptions.length > 0;
  useEffect(() => onExpandedChange(isExpanded), [onExpandedChange, isExpanded]);
  useEffect(() => {
    if (focusTrigger > 0) {
      setFocusIndex(0);
    }
  }, [focusTrigger]);

  return filteredOptions.length <= 0 ? (
    <NoResult>{__('No matches found', 'web-stories')}</NoResult>
  ) : (
    <List
      ref={listRef}
      tabIndex={0}
      id="editor-font-picker-list"
      role="listbox"
      onKeyDown={handleKeyPress}
      aria-label={__('Font List Selector', 'web-stories')}
      aria-required={false}
    >
      {filteredListGroups.map((group, i) => {
        const groupLabelId = `group-${uuidv4()}`;
        return (
          group.options.length > 0 && (
            <Group
              key={group.label}
              role="group"
              aria-labelledby={groupLabelId}
            >
              <GroupLabel id={groupLabelId} role="presentation">
                {group.label}
              </GroupLabel>
              {group.options.map((font, j) => (
                <Option
                  key={font.name}
                  ref={(el) =>
                    (optionsRef.current[
                      getInset(filteredListGroups, i, j)
                    ] = el)
                  }
                  role="option"
                  tabIndex={-1}
                  aria-selected={value === font.name}
                  aria-posinset={getInset(filteredListGroups, i, j)}
                  aria-setsize={filteredOptions.length}
                  data-font={font.name}
                  onClick={() => onSelect(font.name)}
                  fontFamily={
                    font.service.includes('google')
                      ? `'${font.name}::MENU'`
                      : font.name
                  }
                >
                  {value === font.name && (
                    <Selected aria-label={__('Selected', 'web-stories')} />
                  )}
                  {font.name}
                </Option>
              ))}
            </Group>
          )
        );
      })}
    </List>
  );
}

FontList.propTypes = {
  keyword: PropTypes.string,
  value: PropTypes.string,
  onSelect: PropTypes.func,
  onClose: PropTypes.func,
  onExpandedChange: PropTypes.func,
  focusTrigger: PropTypes.number,
};

export default FontList;
