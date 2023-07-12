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
  useRef,
  useState,
  useFocusOut,
  useMemo,
  forwardRef,
  useDebouncedCallback,
} from '@googleforcreators/react';
import type { ForwardedRef } from 'react';
import styled, { css } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import type { StyleOverride } from '../../types/theme';
import SearchInput from './searchInput';
import type { AbstractOption, OptionsContainerProps } from './types';
import { isKeywordFilterable } from './utils';

const Container = styled.div<{
  isInline?: boolean;
  hasDropDownBorder?: boolean;
  $containerStyleOverrides?: StyleOverride;
}>`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  min-width: 120px;
  z-index: 2;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  padding: 5px;
  margin-top: 16px;

  ${({ isInline }) =>
    isInline &&
    css`
      position: absolute;
      margin-top: 0;
      padding: 0;
      min-width: initial;
      width: initial;
    `}

  ${({ theme, hasDropDownBorder }) =>
    hasDropDownBorder &&
    css`
      border: 1px solid ${theme.colors.border.defaultNormal};
    `}

   ${({ $containerStyleOverrides }) => $containerStyleOverrides};
`;

function OptionsContainerWithRef<O extends AbstractOption>(
  {
    onClose,
    isOpen,
    getOptionsByQuery,
    hasSearch,
    renderContents,
    isInline,
    hasDropDownBorder = false,
    containerStyleOverrides,
    title,
    placeholder,
  }: OptionsContainerProps<O>,
  inputRef: ForwardedRef<HTMLInputElement>
) {
  const ref = useRef<HTMLDivElement>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [queriedOptions, setQueriedOptions] = useState<O[] | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [trigger, setTrigger] = useState(0);

  useFocusOut(ref, onClose, [onClose]);

  const debounceHandleLoadOptions = useDebouncedCallback(
    () => void getOptionsByQuery?.(searchKeyword)?.then(setQueriedOptions),
    500
  );

  useEffect(() => {
    if (getOptionsByQuery && isKeywordFilterable(searchKeyword)) {
      debounceHandleLoadOptions();
    } else {
      setQueriedOptions(null);
    }
  }, [getOptionsByQuery, searchKeyword, debounceHandleLoadOptions]);

  useEffect(() => {
    if (isOpen && inputRef && 'current' in inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, inputRef]);

  const listId = useMemo(() => `list-${uuidv4()}`, []);
  return (
    <Container
      role="dialog"
      title={title}
      ref={ref}
      isInline={isInline}
      hasDropDownBorder={hasDropDownBorder}
      $containerStyleOverrides={containerStyleOverrides}
    >
      {hasSearch && (
        <SearchInput
          ref={inputRef}
          value={searchKeyword}
          onChange={setSearchKeyword}
          onClose={onClose}
          isExpanded={isExpanded}
          focusFontListFirstOption={() => setTrigger((v) => v + 1)}
          aria-owns={listId}
          placeholder={placeholder}
        />
      )}
      {renderContents({
        searchKeyword,
        setIsExpanded,
        trigger,
        queriedOptions,
        listId,
      })}
    </Container>
  );
}

// This cast is really annoying, but required to make a forwardRef'ed component
// accept a generic type argument.
// @see https://fettblog.eu/typescript-react-generic-forward-refs/
const OptionsContainer = forwardRef(OptionsContainerWithRef) as <
  O extends AbstractOption,
>(
  props: OptionsContainerProps<O> & {
    ref?: ForwardedRef<HTMLDivElement>;
  }
) => ReturnType<typeof OptionsContainerWithRef>;

export default OptionsContainer;
