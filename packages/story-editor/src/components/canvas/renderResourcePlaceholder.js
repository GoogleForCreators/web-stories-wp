/*
 * Copyright 2022 Google LLC
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
import styled, { css } from 'styled-components';
import { Blurhash } from 'react-blurhash';

const placeholderStyles = css`
  position: absolute !important;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

const BlurhashContainer = styled(Blurhash)`
  ${placeholderStyles}
`;

const BaseColorContainer = styled.div`
  ${placeholderStyles}
  background-color: ${({ $baseColor }) => $baseColor};
`;

function renderResourcePlaceholder({ blurHash, baseColor }) {
  if (blurHash) {
    return (
      <BlurhashContainer hash={blurHash} punch={1} height="100%" width="100%" />
    );
  }

  if (baseColor) {
    return <BaseColorContainer $baseColor={baseColor} />;
  }

  return null;
}
export default renderResourcePlaceholder;
