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

export default {
  title: 'Playground/preview',
};

const LoadingText = styled.p`
  text-align: center;
  font-size: 30px;
  color: #dfdfdf;
`;

const Text = styled.p``;

function Preview() {
  // @todo Get preview markup using localStorage and insert here.
  return (
    <>
      <GlobalStyle />
      <LoadingText>{'Generating Preview..'}</LoadingText>
      <Text>{'Preview Expired'}</Text>
      <Text>{'Please click on the preview button again!'}</Text>
    </>
  );
}

export const _default = Preview;
