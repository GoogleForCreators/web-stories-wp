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
import { rgba } from 'polished';
import styled, { keyframes } from 'styled-components';

/**
 * Internal dependencies
 */
import { ALERT_SEVERITY } from './constants';

const slideIn = keyframes`
	from {
		transform: translateY(100%);
	}
	to {
		transform: translateY(0);
	}
`;

export const AlertContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 208px;
  max-width: 336px;
  min-height: 48px;
  padding: 14px 16px;
  margin-top: 20px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border: ${({ theme }) =>
    `1px solid ${rgba(theme.colors.border.primary, 0.24)}`};
  border-radius: 8px;
  animation: 0.5s ${slideIn} ease-out;
`;
