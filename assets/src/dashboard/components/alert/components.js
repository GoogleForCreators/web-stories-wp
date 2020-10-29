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
import styled, { keyframes } from 'styled-components';

/**
 * Internal dependencies
 */
import { ALERT_SEVERITY, KEYBOARD_USER_SELECTOR } from '../../constants';
import { TypographyPresets } from '../typography';

const slideIn = keyframes`
	from {
		transform: translateX(100%);
	}
	to {
		transform: translateX(0);
	}
`;

const getColor = (severity) => {
  switch (severity) {
    case ALERT_SEVERITY.ERROR:
      return 'danger';

    case ALERT_SEVERITY.WARNING:
      return 'warning';

    case ALERT_SEVERITY.INFO:
      return 'bluePrimary';

    case ALERT_SEVERITY.SUCCESS:
      return 'success';

    default:
      return 'bluePrimary';
  }
};

export const AlertContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 20px;
  margin-top: 20px;
  color: ${({ theme }) => theme.internalTheme.colors.white};
  background-color: ${({ theme, severity }) =>
    theme.internalTheme.colors[getColor(severity)]};
  border-radius: 5px;
  animation: 0.5s ${slideIn} ease-out;
`;

export const AlertText = styled.p`
  ${TypographyPresets.Medium};
  width: calc(100% - 25px);
`;

export const AlertTitle = styled.span`
  font-weight: ${({ theme }) => theme.internalTheme.typography.weight.bold};
  display: block;
`;

export const DismissButton = styled.button`
  align-self: center;
  margin: 0 0 0 auto;
  width: 36px;
  height: 36px;
  background-color: transparent;
  color: ${({ theme }) => theme.internalTheme.colors.white};
  border: ${({ theme }) => theme.internalTheme.borders.transparent};
  cursor: pointer;

  ${KEYBOARD_USER_SELECTOR} &:focus {
    border-color: ${({ theme }) => theme.internalTheme.colors.action};
  }
`;
