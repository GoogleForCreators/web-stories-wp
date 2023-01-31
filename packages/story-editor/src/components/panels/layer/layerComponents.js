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
import styled, { css } from 'styled-components';
import { rgba } from 'polished';
import {
  Button,
  ButtonType,
  Input,
  Text,
  TextSize,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { LAYER_HEIGHT, NESTED_PX } from './constants';

const fadeOutCss = css`
  background-color: var(--background-color);

  ::before {
    position: absolute;
    content: '';
    width: 32px;
    height: 100%;
    top: 0;
    left: 0;
    transform: translateX(-100%);
    background: linear-gradient(
      to right,
      var(--background-color-opaque),
      var(--background-color)
    );
    pointer-events: none;
  }
`;

export const ActionsContainer = styled.div`
  position: absolute;
  display: none;
  align-items: center;
  height: 100%;
  top: 0;
  right: 0;
  padding-right: 6px;
  column-gap: 6px;

  ${fadeOutCss}
`;

export const LayerContainer = styled.div.attrs({
  // Because the layer panel is aria-hidden, we need something else to select by
  'data-testid': 'layer-option',
})`
  position: relative;
  height: ${LAYER_HEIGHT}px;
  width: 100%;
  overflow: hidden;

  --background-color: ${({ theme }) => theme.colors.bg.secondary};
  --background-color-opaque: ${({ theme }) =>
    rgba(theme.colors.bg.secondary, 0)};

  :is(:hover, :focus-within) ${ActionsContainer} {
    display: inline-flex;
  }
`;

export const LayerButton = styled(Button).attrs({
  type: ButtonType.Plain,
  tabIndex: -1,
  role: 'option',
})`
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;

  border: 0;
  padding: 0;
  background: transparent;
  height: 100%;
  width: 100%;
  overflow: hidden;
  align-items: center;
  user-select: none;
  border-radius: 0;
  padding-left: ${({ isNested }) => (isNested ? NESTED_PX : 12)}px;
  transition: revert;

  ${({ isSelected, theme }) =>
    isSelected &&
    css`
      background: ${theme.colors.interactiveBg.tertiaryPress};
      &,
      & + * {
        --background-color: ${theme.colors.interactiveBg.tertiaryPress};
        --background-color-opaque: ${rgba(
          theme.colors.interactiveBg.tertiaryPress,
          0
        )};
        --selected-hover-color: ${theme.colors.interactiveBg.tertiaryHover};
      }
    `}

  :hover {
    background: ${({ theme }) => theme.colors.interactiveBg.tertiaryHover};
  }
  :hover,
  :hover + * {
    --background-color: ${({ theme }) =>
      theme.colors.interactiveBg.tertiaryHover};
    --background-color-opaque: ${({ theme }) =>
      rgba(theme.colors.interactiveBg.tertiaryHover, 0)};
  }

  :active {
    background: ${({ theme }) => theme.colors.interactiveBg.tertiaryPress};
  }
  :active,
  :active + * {
    --background-color: ${({ theme }) =>
      theme.colors.interactiveBg.tertiaryPress};
    --background-color-opaque: ${({ theme }) =>
      rgba(theme.colors.interactiveBg.tertiaryPress, 0)};
  }
`;

export const LayerInputWrapper = styled.div`
  display: grid;
  grid-template-columns: 23px 1fr;
  gap: 12px;
  height: 100%;
  width: 100%;
  padding-left: ${({ isNested }) => (isNested ? NESTED_PX : 12)}px;
  padding-right: 10px;

  :hover {
    background: ${({ theme }) => theme.colors.interactiveBg.tertiaryHover};
  }
  :hover,
  :hover + * {
    --background-color: ${({ theme }) =>
      theme.colors.interactiveBg.tertiaryHover};
    --background-color-opaque: ${({ theme }) =>
      rgba(theme.colors.interactiveBg.tertiaryHover, 0)};
  }
`;

export const LayerDescription = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  margin-left: 0;
  text-align: left;
  color: ${({ theme }) => theme.colors.fg.primary};
`;

export const LayerText = styled(Text.Span).attrs({
  size: TextSize.Small,
})`
  color: inherit;
  white-space: nowrap;
  text-overflow: ' ';
  overflow: hidden;
  max-width: 100%;
  ${({ isHidden }) =>
    isHidden &&
    css`
      opacity: 0.3;
    `};
`;

export const LayerIconWrapper = styled.div`
  ${({ isHidden }) =>
    isHidden &&
    css`
      opacity: 0.3;
    `};
`;

export const FadeOutWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: absolute;
  right: 0;
  aspect-ratio: 1;
  ${fadeOutCss}
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 32px;
  aspect-ratio: 1;
  svg {
    position: relative;
    display: block;
    width: 100%;
    color: ${({ theme }) => theme.colors.fg.secondary};
  }
`;
export const HiddenIconWrapper = styled(IconWrapper)`
  margin-right: -6px;
`;

export const LayerContentContainer = styled.div`
  margin-right: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const LayerInput = styled(Input)`
  overflow: visible;

  div {
    height: 100%;
  }
`;

export const LayerInputForm = styled(LayerDescription).attrs({ as: 'form' })`
  overflow: visible;
`;
