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
  useCallback,
  useEffect,
  useRef,
  useState,
  useFocusOut,
  useMemo,
  forwardRef,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import SearchInput from './searchInput';
import { isKeywordFilterable } from './utils';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
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

const OptionsContainer = forwardRef(function OptionsContainer(
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
  },
  inputRef
) {
  const ref = useRef();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [queriedOptions, setQueriedOptions] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [trigger, setTrigger] = useState(0);

  useFocusOut(ref, onClose, [onClose]);

  const handleSearchInputChanged = useCallback(
    ({ target: { value } }) => setSearchKeyword(value),
    []
  );

  const handleLoadOptions = useCallback(() => {
    getOptionsByQuery(searchKeyword).then(setQueriedOptions);
  }, [getOptionsByQuery, searchKeyword]);

  useEffect(() => {
    if (getOptionsByQuery && isKeywordFilterable(searchKeyword)) {
      handleLoadOptions();
    } else {
      setQueriedOptions(null);
    }
  }, [getOptionsByQuery, searchKeyword, handleLoadOptions]);

  useEffect(() => {
    if (isOpen) {
      inputRef?.current?.focus();
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
          onChange={handleSearchInputChanged}
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
});

OptionsContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getOptionsByQuery: PropTypes.func,
  hasSearch: PropTypes.bool,
  renderContents: PropTypes.func.isRequired,
  isInline: PropTypes.bool,
  hasDropDownBorder: PropTypes.bool,
  title: PropTypes.string,
  placeholder: PropTypes.string,
};

export default OptionsContainer;
