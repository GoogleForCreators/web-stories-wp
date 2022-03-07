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
  useFocusOut,
  forwardRef,
  memo,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { __ } from '@googleforcreators/i18n';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import {
  createOptionFilter,
  isKeywordFilterable,
  getOptions,
  addUniqueEntries,
  getInset,
} from '../utils';
import { Text } from '../../typography';
import { THEME_CONSTANTS } from '../../../theme';
import { noop } from '../../../utils/noop';
import { List, Group, GroupLabel, NoResult } from './styled';
import DefaultRenderer from './defaultRenderer';

const StyledLabel = styled(Text).attrs({
  forwardedAs: 'span',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.tertiary};
`;

const OptionList = forwardRef(function OptionList(
  {
    keyword = '',
    value = '',
    onSelect = noop,
    onClose = noop,
    onExpandedChange = noop,
    focusTrigger = 0,
    options = [],
    primaryOptions,
    primaryLabel,
    priorityOptionGroups = [],
    searchResultsLabel,
    renderer = DefaultRenderer,
    onObserve,
    focusSearch = noop,
    listId,
    containerStyleOverrides,
  },
  listRef
) {
  const OptionRenderer = renderer;
  const optionsRef = useRef([]);
  const [focusIndex, setFocusIndex] = useState(-1);
  const userSeenOptions = useRef([]);

  /*
   * KEYWORD FILTERING
   */
  const filteredListGroups = useMemo(() => {
    // If we're searching, return a single group of search results
    // gotten from all available options
    if (isKeywordFilterable(keyword) && options) {
      return [
        {
          label: searchResultsLabel,
          options: createOptionFilter(options)(keyword),
        },
      ];
    }
    // Otherwise return primary options in one group possibly preceded
    // by an optional groups of priority options if such exist.
    return [
      ...(priorityOptionGroups?.length ? priorityOptionGroups : []),
      {
        label: primaryLabel,
        options: primaryOptions,
      },
    ];
  }, [
    keyword,
    options,
    priorityOptionGroups,
    primaryOptions,
    primaryLabel,
    searchResultsLabel,
  ]);

  /*
   * LAZY OPTIONS LOADING
   */
  // Add option when observed entry is seen
  const observer = useMemo(
    () =>
      new window.IntersectionObserver(
        (entries) => {
          if (onObserve) {
            const newlySeenOptions = entries
              .filter((entry) => entry.isIntersecting)
              .map((entry) => entry.target.dataset.option);
            userSeenOptions.current = addUniqueEntries(
              userSeenOptions.current,
              ...newlySeenOptions
            );
            onObserve(userSeenOptions.current);
          }
        },
        {
          root: listRef.current,
          // Gets ~2 extra items below scroll container BoundingBox
          rootMargin: '60px',
        }
      ),
    [onObserve, listRef]
  );

  // Observe rendered font options
  useLayoutEffect(() => {
    const renderedOptions = optionsRef.current;
    if (onObserve) {
      renderedOptions.forEach((option) => option && observer.observe(option));
    }
    return () => {
      if (onObserve) {
        renderedOptions.forEach(
          (option) => option && observer.unobserve(option)
        );
      }
      // clear existing option references before next update to filteredGroup
      optionsRef.current = [];
    };
  }, [observer, onObserve, filteredListGroups, renderer]);

  /*
   * KEYBOARD ACCESSIBILITY
   */
  const filteredOptions = useMemo(
    () => getOptions(filteredListGroups),
    [filteredListGroups]
  );

  const handleKeyPress = useCallback(
    (evt) => {
      const { key } = evt;

      evt.stopPropagation();
      evt.preventDefault();

      if (key === 'Tab' && evt.shiftKey) {
        focusSearch();
      }

      if (key === 'Escape') {
        onClose();
      } else if (key === 'Enter') {
        if (filteredOptions[focusIndex]) {
          onSelect(filteredOptions[focusIndex]);
        }
      } else if (key === 'ArrowUp') {
        setFocusIndex((index) => Math.max(0, index - 1));
      } else if (key === 'ArrowDown') {
        setFocusIndex((index) =>
          Math.min(filteredOptions.length - 1, index + 1)
        );
      }
    },
    [focusIndex, filteredOptions, onClose, onSelect, focusSearch]
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
  }, [focusIndex, filteredOptions, keyword, onClose, listRef]);

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
      id={listId}
      role="listbox"
      onKeyDown={handleKeyPress}
      aria-label={__('Option List Selector', 'web-stories')}
      aria-required={false}
      containerStyleOverrides={containerStyleOverrides}
    >
      {filteredListGroups.map((group, i) => {
        const groupLabelId = `group-${uuidv4()}`;
        return (
          group.options.length > 0 && (
            <Group
              key={groupLabelId}
              role="group"
              aria-labelledby={groupLabelId}
            >
              {group.label && (
                <GroupLabel id={groupLabelId} role="presentation">
                  <StyledLabel>{group.label}</StyledLabel>
                </GroupLabel>
              )}
              {group.options.map((option, j) => {
                return (
                  <OptionRenderer
                    key={option.id || ''}
                    role={'option'}
                    tabIndex="-1"
                    aria-selected={value === option.id}
                    aria-posinset={getInset(filteredListGroups, i, j)}
                    aria-setsize={filteredOptions.length}
                    data-option={option.id}
                    onClick={() => onSelect(option)}
                    ref={(el) =>
                      (optionsRef.current[getInset(filteredListGroups, i, j)] =
                        el)
                    }
                    option={option}
                    value={value}
                  />
                );
              })}
            </Group>
          )
        );
      })}
    </List>
  );
});

OptionList.propTypes = {
  keyword: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelect: PropTypes.func,
  onClose: PropTypes.func,
  onExpandedChange: PropTypes.func,
  focusTrigger: PropTypes.number,
  options: PropTypes.array,
  primaryOptions: PropTypes.array.isRequired,
  primaryLabel: PropTypes.string,
  priorityOptionGroups: PropTypes.array,
  searchResultsLabel: PropTypes.string,
  renderer: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  onObserve: PropTypes.func,
  listId: PropTypes.string.isRequired,
  focusSearch: PropTypes.func,
  containerStyleOverrides: PropTypes.array,
};

export default memo(OptionList);
