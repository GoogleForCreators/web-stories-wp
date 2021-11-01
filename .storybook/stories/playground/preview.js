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
import styled, { createGlobalStyle } from 'styled-components';
export const GlobalStyle = createGlobalStyle`
  body {
    background-color: #1a1d1f;
    margin: 0;
    padding: 0;
  }
`;
import { useEffect } from 'react';

export default {
  title: 'Playground/preview',
};

const Text = styled.p``;

function Preview() {
  const content = window.localStorage.getItem('preview_markup');

  useEffect(() => {
    if (content) {
      document.open();
      document.write(content);
      document.close();
    }
  }, [content]);

  return !content ? (
    <>
      <GlobalStyle />
      <Text>{'No Preview Available'}</Text>
    </>
  ) : null;
}

export const _default = Preview;
