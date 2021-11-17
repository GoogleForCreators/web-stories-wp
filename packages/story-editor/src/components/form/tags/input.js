/*
 * Copyright 2021 Google LLC
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
  themeHelpers,
  BaseInput,
  List,
  noop,
} from '@web-stories-wp/design-system';
import {
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useCallback,
} from '@web-stories-wp/react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
/**
 * Internal dependencies
 */
import reducer, { ACTIONS } from './reducer';
import Tag from './tag';

const INPUT_KEY = uuidv4();

const Border = styled.div`
  ${({ theme, isInputFocused }) => css`
    color: ${theme.colors.fg.primary};
    border: 1px solid ${theme.colors.border.defaultNormal};
    border-radius: ${theme.borders.radius.small};
    ${isInputFocused && themeHelpers.focusCSS};
  `}
  display: flex;
  flex-direction: column;
  margin-bottom: 6px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0;
`;

const TextInput = styled(BaseInput).attrs({ type: 'text' })`
  width: auto;
  flex-grow: 1;
  height: 32px;
  margin: 2px 0;
  padding-left: 4px;
`;

const SuggestionList = styled(List)`
  max-height: 120px;
  overflow-y: scroll;
  border-top: ${({ theme }) =>
    `1px solid ${theme.colors.border.defaultNormal}`};
  display: block;
  list-style-type: none;
  width: 100%;
  padding: 6px 4px 4px;
  margin-top: 6px;
  li {
    cursor: pointer;
    padding: 4px;
    width: 100%;
    ${themeHelpers.focusableOutlineCSS()}
    border-radius: ${({ theme }) => theme.borders.radius.small};

    &:hover {
      background-color: ${({ theme }) => theme.colors.bg.tertiary};
    }
  }
`;
function Input({
  suggestedTerms = [],
  onTagsChange,
  onInputChange,
  suggestedTermsLabel,
  tagDisplayTransformer,
  tokens = [],
  onUndo = noop,
  ...props
}) {
  const [{ value, tags, offset, tagBuffer }, dispatch] = useReducer(reducer, {
    value: '',
    tags: [...tokens],
    tagBuffer: null,
    offset: 0,
  });

  // isInputFocused is used to update the styled state of the input area.
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

  // inputRef is used to return focus to input after keydown actions to avoid focused state being hijacked.
  const inputRef = useRef();
  const menuRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    dispatch({ type: ACTIONS.UPDATE_TAGS, payload: tokens });
  }, [tokens]);

  const suggestionListId = uuidv4();
  const totalSuggestions = suggestedTerms.length;
  // suggestedTerms is returned from a debounced callback,
  // we want to update isSuggestionsOpen via a useEffect to prevent sluggish closing.
  useEffect(() => {
    setIsSuggestionsOpen(totalSuggestions > 0);
  }, [totalSuggestions]);

  // Allow parents to pass onTagsChange callback
  // that updates as tags does.
  const onTagChangeRef = useRef(onTagsChange);
  onTagChangeRef.current = onTagsChange;
  useEffect(() => {
    if (!tagBuffer) {
      return;
    }
    onTagChangeRef.current?.(tagBuffer);
  }, [tagBuffer]);

  // Allow parents to pass onInputChange callback
  // that updates as value does.
  const onInputChangeRef = useRef(onInputChange);
  onInputChangeRef.current = onInputChange;
  useEffect(() => {
    onInputChangeRef.current?.(value);
  }, [value]);

  // Prepare and memoize event handlers to be as self
  // contained and descriptive as possible
  const { handleFocus, handleBlur, handleKeyDown, handleChange, removeTag } =
    useMemo(
      () => ({
        // Key interactions are modeled after WordPress Tag input UX
        // and are only available when focused on the text input
        handleKeyDown: (e) => {
          if (e.target.value === '') {
            if (e.key === 'ArrowLeft') {
              dispatch({ type: ACTIONS.INCREMENT_OFFSET });
            }
            if (e.key === 'ArrowRight') {
              dispatch({ type: ACTIONS.DECREMENT_OFFSET });
            }
            if (e.key === 'Backspace') {
              dispatch({ type: ACTIONS.REMOVE_TAG });
            }
            if (e.key === 'z' && e.metaKey) {
              onUndo(e);
            }
          }
          if (e.key === 'ArrowDown' && suggestedTerms.length > 0) {
            menuRef?.current?.firstChild?.focus();
          }
          if (['Comma', ',', 'Enter'].includes(e.key)) {
            dispatch({ type: ACTIONS.SUBMIT_VALUE });
          }
        },
        handleChange: (e) => {
          dispatch({ type: ACTIONS.UPDATE_VALUE, payload: e.target.value });
        },
        removeTag: (tag) => () => {
          dispatch({ type: ACTIONS.REMOVE_TAG, payload: tag });
          inputRef?.current.focus();
        },
        handleFocus: () => {
          setIsInputFocused(true);
        },
        handleBlur: () => {
          dispatch({ type: ACTIONS.RESET_OFFSET });
          setIsInputFocused(false);
        },
      }),
      [onUndo, suggestedTerms]
    );

  const renderedTags = tagBuffer || tags;

  const handleTagSelectedFromSuggestions = useCallback((e, selectedValue) => {
    e.preventDefault();
    setIsSuggestionsOpen(false);
    dispatch({ type: ACTIONS.SUBMIT_VALUE, payload: selectedValue });
    inputRef?.current.focus();
  }, []);

  const handleSuggestionKeyDown = useCallback(
    (e, index, name) => {
      const nextChild = index + 1;
      const previousChild = index - 1;
      if (e.key === 'ArrowDown') {
        if (nextChild < totalSuggestions) {
          menuRef?.current?.children?.[nextChild]?.focus();
        }
      }
      if (e.key === 'ArrowUp') {
        if (previousChild < 0) {
          inputRef?.current.focus();
        } else {
          menuRef?.current?.children?.[previousChild]?.focus();
        }
      }
      if (e.key === 'Enter') {
        handleTagSelectedFromSuggestions(e, name);
      }
    },
    [handleTagSelectedFromSuggestions, totalSuggestions]
  );
  return (
    <Border ref={containerRef} isInputFocused={isInputFocused}>
      <InputWrapper>
        {
          // Text input should move, relative to end, with offset
          // this helps with natural tab order and visuals
          // as you ArrowLeft or ArrowRight through tags
          [
            ...renderedTags.slice(0, renderedTags.length - offset),
            INPUT_KEY,
            ...renderedTags.slice(renderedTags.length - offset),
          ].map((tag) =>
            tag === INPUT_KEY ? (
              <TextInput
                {...props}
                key={INPUT_KEY}
                value={value}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                size="4"
                ref={inputRef}
                autoComplete={isSuggestionsOpen ? 'off' : 'on'}
                aria-expanded={isSuggestionsOpen}
                aria-autocomplete="list"
                aria-owns={isSuggestionsOpen ? suggestionListId : null}
                role="combobox"
              />
            ) : (
              <Tag key={tag} onDismiss={removeTag(tag)}>
                {tagDisplayTransformer(tag) || tag}
              </Tag>
            )
          )
        }
      </InputWrapper>
      {isSuggestionsOpen && (
        <SuggestionList
          aria-label={suggestedTermsLabel}
          role="listbox"
          ref={menuRef}
          id={suggestionListId}
          data-testid="suggested_terms_list"
        >
          {suggestedTerms.map(({ name, id }, index) => (
            <li
              key={id}
              aria-selected={value === name}
              role="option"
              tabIndex={0}
              onClick={(e) => handleTagSelectedFromSuggestions(e, name)}
              onKeyDown={(e) => handleSuggestionKeyDown(e, index, name)}
            >
              {name}
            </li>
          ))}
        </SuggestionList>
      )}
    </Border>
  );
}
Input.propTypes = {
  initialTags: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string.isRequired,
  onInputChange: PropTypes.func,
  onTagsChange: PropTypes.func,
  onUndo: PropTypes.func,
  suggestedTerms: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.number, name: PropTypes.string })
  ),
  suggestedTermsLabel: PropTypes.string,
  tagDisplayTransformer: PropTypes.func,
  tokens: PropTypes.arrayOf(PropTypes.string),
};
export default Input;
