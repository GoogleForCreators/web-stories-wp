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
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import { Gradient, Scrim, Poster } from '../../shared/grid/components';

// Allows grid item contents to overlay in a set space
export const CardWrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;

  transition: opacity ease-in-out 300ms;

  &:hover {
    ${Gradient}, ${Scrim} {
      opacity: 1;
    }
  }

  ${Gradient}, ${Scrim} {
    opacity: ${({ $isSelected }) => ($isSelected ? 1 : 0)};
  }
`;

export const TemplateDisplayContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding-bottom: 16px;

  a,
  button {
    margin: auto auto 0;
  }
`;

export const PicturePoster = styled(Poster).attrs({ as: 'picture' })`
  background: transparent;
  & > img {
    height: 100%;
    width: 100%;
    object-fit: fill;
    border-radius: ${({ theme }) => theme.borders.radius.medium};
  }
`;
