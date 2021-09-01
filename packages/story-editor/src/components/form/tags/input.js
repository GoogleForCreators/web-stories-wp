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

/**
 * Internal dependencies
 */
import reducer, { ACTIONS } from './reducer';
import Tag from './tag';

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

  > input {
    ${themeHelpers.expandTextPreset(
      ({ paragraph }, { SMALL }) => paragraph[SMALL]
    )}
    border: none;
    outline: none;
    background: transparent;
    color: inherit;
    flex-grow: 1;
    height: 38px;
    margin: 3px 0;
  }
`;

function Input(props) {
  const [{ value, tags }, dispatch] = useReducer(reducer, {
    value: '',
    tags: [],
  });
  const [isInputFocused, setIsInputFocued] = useState(false);

  const { handleFocus, handleBlur, handleKeyDown, handleChange, removeTag } =
    useMemo(
      () => ({
        handleChange: (e) => {
          dispatch({ type: ACTIONS.UPDATE_VALUE, payload: e.target.value });
        },
        handleKeyDown: (e) => {
          if (['Comma', 'Enter'].includes(e.code)) {
            dispatch({ type: ACTIONS.SUBMIT_VALUE });
          }
        },
        removeTag: (tag) => () => {
          dispatch({ type: ACTIONS.REMOVE_TAG, payload: tag });
        },
        handleFocus: () => setIsInputFocued(true),
        handleBlur: () => setIsInputFocued(false),
      }),
      []
    );

  return (
    <Border isInputFocused={isInputFocused}>
      {tags.map((tag) => (
        <Tag key={tag} onDismiss={removeTag(tag)}>
          {tag}
        </Tag>
      ))}
      <input
        {...props}
        type="text"
        value={value}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </Border>
  );
}

export default Input;
