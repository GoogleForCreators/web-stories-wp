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
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { THEME_CONSTANTS } from '../../theme';
import { ChevronDownSmall } from '../../icons';

type Direction = 'up' | 'down' | 'left' | 'right';
const rotate: Record<Direction, [number, number]> = {
  up: [180, 0],
  down: [0, 180],
  left: [-90, 0],
  right: [90, 0],
};
/**
 * Simple component that shows a chevron icon which rotates when
 * controlled contents are shown (open). Values for `direction` prop of
 * 'up' or 'down' rotate icon 180deg, and 'right' or 'left' rotate down.
 */
const Disclosure = styled(ChevronDownSmall)<{
  direction?: Direction;
  disabled?: boolean;
  duration?: number;
  isOpen?: boolean;
}>`
  height: ${THEME_CONSTANTS.ICON_SIZE}px;
  width: auto;
  margin: 0 -10px;
  color: ${({ disabled, theme }) =>
    disabled ? theme.colors.fg.disable : theme.colors.fg.secondary};
  transition: transform ${({ duration = 0 }) => duration};
  transform: ${({ direction = 'down', isOpen = false }) => {
    const [whenClosed, whenOpen] = rotate[direction];
    return `rotate(${isOpen ? whenOpen : whenClosed}deg);`;
  }};
`;

export default Disclosure;
