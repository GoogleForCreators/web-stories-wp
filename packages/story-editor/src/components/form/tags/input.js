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
import { themeHelpers, BaseInput, noop } from '@web-stories-wp/design-system';
import {
  Fragment,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useCallback,
  useFocusOut,
} from '@web-stories-wp/react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
/**
 * Internal dependencies
 */
import { useConfig } from '../../../app';
import { noop } from '../../../utils/noop';
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
  flex-wrap: wrap;
  padding: 3px 6px;
  margin-bottom: 6px;
`;

const TextInput = styled(BaseInput).attrs({ type: 'text' })`
  width: auto;
  flex-grow: 1;
  height: 38px;
  margin: 3px 0;
`;

function Input({
  suggestedTerms = [],
  id,
  onTagsChange,
  onInputChange,
  suggestedTermsLabel,
  tagDisplayTransformer,
  tokens = [],
  onUndo = noop,
  ...props
}) {
  const { isRTL } = useConfig();
  const [{ value, tags, offset, tagBuffer }, dispatch] = useReducer(reducer, {
    value: '',
    tags: [...tokens],
    tagBuffer: null,
    offset: 0,
  });

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [suggestedTermsFocus, setSuggestedTermsFocus] = useState(false);
  const [dynamicPlacement, setDynamicPlacement] = useState(PLACEMENT.BOTTOM);

  const inputRef = useRef();
  const menuRef = useRef();
  const containerRef = useRef();
  const listId = uuidv4();

  useEffect(() => {
    dispatch({ type: ACTIONS.UPDATE_TAGS, payload: tokens });
  }, [tokens]);

  const filteredSuggestedTerms = useMemo(() => {
    const cleanValue = value.trim().toLowerCase();
    if (cleanValue.length < 3) {
      return [];
    }
    return suggestedTerms.reduce((accum, suggestion) => {
      if (!suggestion.toLowerCase().startsWith(cleanValue)) {
        return accum;
      }
      return [
        ...accum,
        {
          label: suggestion,
          value: suggestion,
          id: uuidv4(),
        },
      ];
    }, []);
  }, [suggestedTerms, value]);

  const dropDownMenuPlacement = useCallback(
    (popupRef) => {
      // check to see if there's an overlap with the window edge
      const { bottom, top } = popupRef.current?.getBoundingClientRect() || {};

      // if the popup was assigned as bottom we want to always check it
      if (
        dynamicPlacement.startsWith('bottom') &&
        bottom >= window.innerHeight
      ) {
        setDynamicPlacement(PLACEMENT.TOP);
      }
      // if the popup was assigned as top we want to always check it
      if (dynamicPlacement.startsWith('top') && top <= 0) {
        setDynamicPlacement(PLACEMENT.BOTTOM);
      }
    },
    [dynamicPlacement]
  );

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

          if (['Comma', 'Enter', 'Tab'].includes(e.key)) {
            // TODO something here to prevent focus shift
            dispatch({ type: ACTIONS.SUBMIT_VALUE });
          }
        },
        handleChange: (e) => {
          dispatch({ type: ACTIONS.UPDATE_VALUE, payload: e.target.value });
        },
        removeTag: (tag) => () => {
          dispatch({ type: ACTIONS.REMOVE_TAG, payload: tag });
        },
        handleFocus: () => {
          setIsInputFocused(true);
        },
        handleBlur: () => {
          setIsInputFocused(false);
        },
      }),
      [onUndo]
    );

  const renderedTags = tagBuffer || tags;

  const handleReturnFocusToInput = useCallback(() => {
    inputRef?.current.focus();
    setSuggestedTermsFocus(false);
  }, []);

  const handleTagSelectedFromSuggestions = useCallback(
    async (e, selectedValue) => {
      e.preventDefault();
      // It's important these run in order so that focus remains intact
      await setSuggestedTermsFocus(false);
      await dispatch({ type: ACTIONS.SUBMIT_VALUE, payload: selectedValue });
      await inputRef?.current.focus();
    },
    []
  );

  const handleSubmitOnFocusOut = useCallback(() => {
    if (filteredSuggestedTerms.length <= 0 && value.length > 0) {
      setSuggestedTermsFocus(false);
      dispatch({ type: ACTIONS.SUBMIT_VALUE, payload: value });
    }
  }, [filteredSuggestedTerms, value]);

  useFocusOut(containerRef, handleSubmitOnFocusOut, [handleSubmitOnFocusOut]);

  return (
    <Border ref={containerRef} isInputFocused={isInputFocused}>
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
            <Fragment key={id}>
              <TextInput
                {...props}
                key={INPUT_KEY}
                value={value}
                id={id}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                size="4"
                ref={inputRef}
                autoComplete="off"
              />
              {filteredSuggestedTerms.length > 0 && value.length >= 3 && (
                <Popup
                  anchor={containerRef}
                  isOpen={filteredSuggestedTerms.length > 0}
                  placement={dynamicPlacement}
                  refCallback={dropDownMenuPlacement}
                  fillWidth
                >
                  <MenuWithRef
                    activeValue={value}
                    ref={menuRef}
                    listId={listId}
                    hasMenuRole
                    handleReturnToParent={handleReturnFocusToInput}
                    isRTL={isRTL}
                    options={[{ group: filteredSuggestedTerms }]}
                    onMenuItemClick={handleTagSelectedFromSuggestions}
                    onDismissMenu={noop} // No need to dismiss, it's either open with options or hidden
                    menuAriaLabel={suggestedTermsLabel}
                    isMenuFocused={suggestedTermsFocus}
                    isPositionedOnTop={dynamicPlacement === PLACEMENT.TOP}
                  />
                </Popup>
              )}
            </Fragment>
          ) : (
            <Tag key={tag} onDismiss={removeTag(tag)}>
              {tagDisplayTransformer(tag) || tag}
            </Tag>
          )
        )
      }
    </Border>
  );
}
Input.propTypes = {
  suggestedTerms: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  initialTags: PropTypes.arrayOf(PropTypes.string),
  onTagsChange: PropTypes.func,
  onInputChange: PropTypes.func,
  onUndo: PropTypes.func,
  tagDisplayTransformer: PropTypes.func,
  tokens: PropTypes.arrayOf(PropTypes.string),
};
export default Input;
