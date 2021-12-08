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

// Foundational styled components that are
// shared by grid instances to create
// the final presentation of grid items

// Gradient overlays the grid item poster
export const Gradient = styled.div`
  position: absolute;
  bottom: 0;
  height: 67%;
  width: 100%;
  border-radius: ${({ theme }) => theme.borders.radius.medium};
  background: ${({ theme }) => theme.colors.gradient.posterOverlay};
`;

// Holds grid item content
export const Scrim = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border-radius: ${({ theme }) => theme.borders.radius.medium};
  background: ${({ theme }) => theme.colors.opacity.black3};
`;

// Keeps grid item position contained
export const Container = styled.div`
  position: relative;
`;

// Displays grid item image if available
// as background of grid item area
export const Poster = styled.div`
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borders.radius.medium};
  background: ${({ theme }) => theme.colors.gradient.placeholder};
`;
