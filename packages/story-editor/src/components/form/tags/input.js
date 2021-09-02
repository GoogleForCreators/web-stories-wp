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
import { themeHelpers } from '@web-stories-wp/design-system';
import { useMemo, useReducer, useState } from '@web-stories-wp/react';
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

const TextInput = styled.input.attrs({ type: 'text' })`
  ${themeHelpers.expandTextPreset(
    ({ paragraph }, { SMALL }) => paragraph[SMALL]
  )}
  flex-grow: 1;
  flex-basis: 5ch;
  border: none;
  outline: none;
  background: transparent;
  color: inherit;
  height: 38px;
  margin: 3px 0;
`;

function Input(props) {
  const [{ value, tags, offset }, dispatch] = useReducer(reducer, {
    value: '',
    tags: [],
    offset: 0,
  });
  const [isInputFocused, setIsInputFocued] = useState(false);

  const { handleFocus, handleBlur, handleKeyDown, handleChange, removeTag } =
    useMemo(
      () => ({
        handleChange: (e) => {
          dispatch({ type: ACTIONS.UPDATE_VALUE, payload: e.target.value });
        },
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
      {[
        ...tags.slice(0, tags.length - offset),
        INPUT_KEY,
        ...tags.slice(tags.length - offset),
      ].map((tag) =>
        tag === INPUT_KEY ? (
          <TextInput
            key={INPUT_KEY}
            {...props}
            value={value}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        ) : (
          <Tag key={tag} onDismiss={removeTag(tag)}>
            {tag}
          </Tag>
        )
      )}
    </Border>
  );
}

export default Input;
