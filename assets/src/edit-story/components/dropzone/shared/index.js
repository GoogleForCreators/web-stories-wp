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
import { rgba } from 'polished';
/**
 * Internal dependencies
 */
import { ReactComponent as UploadIcon } from '../icons/upload.svg';

export const DropzoneComponent = styled.div`
  min-width: 100%;
  min-height: 100%;
`;
export const OverContent = styled.div``;

export const OverlayWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => rgba(theme.colors.bg.v1, 0.6)};
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
`;
export const Heading = styled.h4`
  color: ${({ theme }) => theme.colors.fg.v1};
  margin: 0;
`;
export const Text = styled.p`
  color: ${({ theme }) => theme.colors.fg.v1};
`;
export const Icon = styled(UploadIcon)`
  height: 54px;
  width: 54px;
  fill: ${({ theme }) => theme.colors.fg.v1};
`;
export const Overlay = styled.div`
  position: absolute;
  top: 45%;
  text-align: center;
  width: 100%;
  z-index: 999;
`;
