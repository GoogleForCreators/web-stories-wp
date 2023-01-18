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
import { v4 as uuidv4 } from 'uuid';
import { __ } from '@googleforcreators/i18n';
import styled from 'styled-components';
import type { ForwardedRef, KeyboardEvent } from 'react';

/**
 * Internal dependencies
 */
import { noop } from '../../../utils/noop';
import useForwardedRef from '../../../utils/useForwardedRef';
import { TextSize } from '../../../theme';
import { Text } from '../../typography';
import {
  createOptionFilter,
  isKeywordFilterable,
  getOptions,
  addUniqueEntries,
  getInset,
} from '../utils';
import type { AbstractOption, OptionListProps } from '../types';
import { List, GroupList, GroupLabel, NoResult } from './styled';
import DefaultRenderer from './defaultRenderer';

const StyledLabel = styled(Text.Span).attrs({
  size: TextSize.XSmall,
})`
  color: ${({ theme }) => theme.colors.fg.tertiary};
`;

function OptionListWithRef<O extends AbstractOption>(
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
    renderer: OptionRenderer = DefaultRenderer<O>,
    onObserve,
    focusSearch = noop,
    listId,
    listStyleOverrides,
    noMatchesFoundLabel = __('No matches found', 'web-stories'),
  }: OptionListProps<O>,
  forwardedListRef: ForwardedRef<HTMLDivElement>
) {
  const listRef = useForwardedRef(forwardedListRef);
  const optionsRef = useRef<(HTMLLIElement | null)[]>([]);
  const [focusIndex, setFocusIndex] = useState(-1);
  const userSeenOptions = useRef<string[]>([]);

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
  const observer = useMemo(() => {
    if (!listRef.current) {
      return null;
    }
    return new window.IntersectionObserver(
      (entries) => {
        if (onObserve) {
          const newlySeenOptions: string[] = entries
            .filter((entry) => entry.isIntersecting)
            .map((entry) => entry.target)
            .filter((t): t is HTMLElement => t instanceof HTMLElement)
            .map((target) => target.dataset.option)
            .filter((o): o is string => Boolean(o));
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
    );
  }, [onObserve, listRef]);

  // Observe rendered font options
  useLayoutEffect(() => {
    const renderedOptions = optionsRef.current;
    if (onObserve) {
      renderedOptions.forEach((option) => option && observer?.observe(option));
    }
    return () => {
      if (onObserve) {
        renderedOptions.forEach(
          (option) => option && observer?.unobserve(option)
        );
      }
      // clear existing option references before next update to filteredGroup
      optionsRef.current = [];
    };
  }, [observer, onObserve, filteredListGroups, OptionRenderer]);

  /*
   * KEYBOARD ACCESSIBILITY
   */
  const filteredOptions = useMemo(
    () => getOptions(filteredListGroups),
    [filteredListGroups]
  );

  const handleKeyPress = useCallback(
    (evt: KeyboardEvent) => {
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
    <NoResult>{noMatchesFoundLabel}</NoResult>
  ) : (
    <List
      ref={listRef}
      tabIndex={0}
      id={listId}
      role="listbox"
      onKeyDown={handleKeyPress}
      aria-label={__('Option List Selector', 'web-stories')}
      aria-required={false}
      $listStyleOverrides={listStyleOverrides}
    >
      {filteredListGroups.map((group, i) => {
        const groupLabelId = `group-${uuidv4()}`;
        return (
          group.options.length > 0 && (
            <GroupList
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
                const optionInset = getInset(filteredListGroups, i, j);

                return (
                  <OptionRenderer
                    key={option.id || ''}
                    role={'option'}
                    tabIndex={-1}
                    aria-selected={value === option.id}
                    aria-posinset={optionInset + 1}
                    aria-setsize={filteredOptions.length}
                    data-option={option.id}
                    onClick={() => onSelect(option)}
                    ref={(el: HTMLLIElement | null) =>
                      (optionsRef.current[optionInset] = el)
                    }
                    option={option}
                    value={value}
                  />
                );
              })}
            </GroupList>
          )
        );
      })}
    </List>
  );
}

// This cast is really annoying, but required to make a forwardRef'ed component
// accept a generic type argument.
// @see https://fettblog.eu/typescript-react-generic-forward-refs/
const OptionList = memo(forwardRef(OptionListWithRef)) as <
  O extends AbstractOption
>(
  props: OptionListProps<O> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
  }
) => ReturnType<typeof OptionListWithRef>;

export default OptionList;
