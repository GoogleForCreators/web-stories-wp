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
import { useFont } from '../../../../app/font';
import useFocusOut from '../../../../utils/useFocusOut';
import {
  createOptionFilter,
  isKeywordFilterable,
  getOptions,
  addUniqueEntry,
  getInset,
} from './utils';
import { List, Group, GroupLabel, Option, Selected, NoResult } from './styled';

function OptionList({
  keyword = '',
  value = '',
  onSelect = () => {},
  onClose = () => {},
  onExpandedChange = () => {},
  focusTrigger = 0,
  options,
  primaryOptions,
  primaryLabel,
  priorityOptions = [],
  priorityLabel,
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
      [...options, ...priorityOptions, ...primaryOptions].reduce(
        (lookup, option) => ({
          ...lookup,
          [option.id]: option,
        }),
        {}
      ),
    [options, priorityOptions, primaryOptions]
  );

  /*
   * KEYWORD FILTERING
   */
  const filteredListGroups = useMemo(() => {
    const groups = [];
    if (priorityOptions?.length) {
      groups.push({
        label: priorityLabel,
        options: createOptionFilter(priorityOptions)(keyword),
      });
    }
    groups.push({
      label: primaryLabel,
      options: isKeywordFilterable(keyword)
        ? createOptionFilter(options)(keyword)
        : primaryOptions,
    });
    return groups;
  }, [
    keyword,
    options,
    priorityOptions,
    primaryOptions,
    priorityLabel,
    primaryLabel,
  ]);

  /*
   * LAZY OPTIONS LOADING
   */
  // Add option when observed entry is seen
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
      aria-label={__('Option List Selector', 'web-stories')}
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
              {group.label && (
                <GroupLabel id={groupLabelId} role="presentation">
                  {group.label}
                </GroupLabel>
              )}
              {group.options.map((option, j) => (
                <Option
                  key={option.id}
                  ref={(el) =>
                    (optionsRef.current[
                      getInset(filteredListGroups, i, j)
                    ] = el)
                  }
                  role="option"
                  tabIndex={-1}
                  aria-selected={value === option.name}
                  aria-posinset={getInset(filteredListGroups, i, j)}
                  aria-setsize={filteredOptions.length}
                  onClick={() => onSelect(option.id)}
                >
                  {value === option.id && (
                    <Selected aria-label={__('Selected', 'web-stories')} />
                  )}
                  {option.name}
                </Option>
              ))}
            </Group>
          )
        );
      })}
    </List>
  );
}

OptionList.propTypes = {
  keyword: PropTypes.string,
  value: PropTypes.string,
  onSelect: PropTypes.func,
  onClose: PropTypes.func,
  onExpandedChange: PropTypes.func,
  focusTrigger: PropTypes.number,
};

export default OptionList;
