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
import { Close as CloseIconBase } from '../../../../icons';

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 300px;
`;

export const AnimationList = styled.div(
  ({ theme }) => `
    position: relative;
    width: 100%;
    height: 100%;
    overflow: scroll;
    background-color: ${theme.internalTheme.colors.gray25};
  `
);

export const ScrubBarContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 90px;
  z-index: 10;
  pointer-events: none;
`;

export const ScrubBar = styled.div`
  position: absolute;
  background-color: red;
  top: 0;
  bottom: 0;
  left: 0;
  width: ${({ width }) => width}px;
  z-index: 10;
  transform-origin: 0% 0%;
  pointer-events: auto;
  cursor: ${({ isDragging }) => (isDragging ? 'grabbing' : 'grab')};
  opacity: ${({ opacity }) => opacity};
  transform: translateX(calc(var(--scrub-offset, 0) * 1px));
  transition: opacity 0.2s linear;
`;

export const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  top: 2px;
  right: 2px;
  border: none;
`;

export const DeleteIcon = styled(CloseIconBase).attrs({
  width: 12,
  height: 12,
})`
  color: ${({ theme }) => theme.internalTheme.colors.gray700};
`;

export const LabelButton = styled.button(
  ({ theme, isActive }) => `
    text-transform: uppercase;
    border: none;
    cursor: pointer;

    ${
      isActive &&
      `
        color: ${theme.internalTheme.colors.bluePrimary};
        font-weight: 700;
      `
    }
  `
);

export const CancelButton = styled.button`
  font-size: 11px;
`;

export const AnimationPanel = styled.div`
  padding: 20px;
  width: 400px;
  height: 100%;
  overflow: scroll;
`;

export const FormField = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;

  > label {
    text-transform: capitalize;
  }
`;

export const TimelineAnimation = styled.div(
  ({ theme }) => `
    display: flex;
    align-items: center;
    width: 100%;
    border: none;
    border-bottom: 1px solid ${theme.internalTheme.colors.gray600};
    margin-bottom: 10px;
  `
);

export const TimelineLabel = styled.div(
  ({ theme }) => `
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100px;
    padding: 20px 0;
    border-right: 1px solid ${theme.internalTheme.colors.gray600};
    background-color: ${theme.internalTheme.colors.white};
  `
);

export const TimelineBarContainer = styled.div(
  ({ theme }) => `
    position: relative;
    width: 100%;

    &::after {
      display: block;
      content: '';
      width: 100%;
      height: 1px;
      background-color: ${theme.internalTheme.colors.gray300};
    }
  `
);

export const TimelineBar = styled.button(
  ({ theme, offset, width }) => `
    cursor: pointer;
    position: absolute;
    top: -10px;
    left: ${offset}%;
    width: ${width}%;
    height: 20px;
    background-color: ${theme.internalTheme.colors.bluePrimary};
  `
);
