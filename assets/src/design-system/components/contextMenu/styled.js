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
import styled, { css } from 'styled-components';

export const Popover = styled.div(
  ({ isOpen }) => css`
    position: absolute;
    display: none;

    ${isOpen &&
    css`
      display: block;
      z-index: 10;
      opacity: 1;
      pointer-events: auto;
    `};
  `
);

export const Shadow = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: ${({ theme }) => theme.borders.radius.small};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  pointer-events: none;
`;
