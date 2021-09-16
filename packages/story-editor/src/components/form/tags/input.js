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
import { themeHelpers, BaseInput } from '@web-stories-wp/design-system';
import {
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
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
  onTagsChange,
  onInputChange,
  tagDisplayTransformer,
  initialTags = [],
  ...props
}) {
  const [{ value, tags, offset }, dispatch] = useReducer(reducer, {
    value: '',
    tags: [...initialTags],
    offset: 0,
  });
  const [isInputFocused, setIsInputFocued] = useState(false);

  // Allow parents to pass onTagsChange callback
  // that updates as tags does.
  const onTagChangeRef = useRef(onTagsChange);
  onTagChangeRef.current = onTagsChange;
  useEffect(() => {
    onTagChangeRef.current?.(tags);
  }, [tags]);

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
          if (e.key === 'ArrowLeft' && e.target.value === '') {
            dispatch({ type: ACTIONS.INCREMENT_OFFSET });
          }
          if (e.key === 'ArrowRight' && e.target.value === '') {
            dispatch({ type: ACTIONS.DECREMENT_OFFSET });
          }
          if (e.key === 'Backspace' && e.target.value === '') {
            dispatch({ type: ACTIONS.REMOVE_TAG });
          }
          if (['Comma', 'Enter'].includes(e.key)) {
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
          setIsInputFocued(true);
        },
        handleBlur: () => {
          dispatch({ type: ACTIONS.RESET_OFFSET });
          setIsInputFocued(false);
        },
      }),
      []
    );

  return (
    <Border isInputFocused={isInputFocused}>
      {
        // Text input should move, relative to end, with offset
        // this helps with natural tab order and visuals
        // as you ArrowLeft or ArrowRight through tags
        [
          ...tags.slice(0, tags.length - offset),
          INPUT_KEY,
          ...tags.slice(tags.length - offset),
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
            />
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
  onTagsChange: PropTypes.func,
  onInputChange: PropTypes.func,
  tagDisplayTransformer: PropTypes.func,
  initialTags: PropTypes.arrayOf(PropTypes.string),
};
export default Input;
