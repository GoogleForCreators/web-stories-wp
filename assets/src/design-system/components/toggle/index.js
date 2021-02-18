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
import propTypes from 'prop-types';
import styled, { css } from 'styled-components';
/**
 * Internal dependencies
 */
import { Checkmark } from '../../icons';
import { FOCUS_VISIBLE_SELECTOR } from '../../theme/global';

const BORDER_WIDTH = 1;
const TOGGLE_HEIGHT = 20;
const TOGGLE_WIDTH = 44;
const CIRCLE_DIAMETER = 28;
const CIRCLE_INITIAL_POSITION = (TOGGLE_HEIGHT - CIRCLE_DIAMETER) / 2;
const CIRCLE_FINAL_POSITION =
  TOGGLE_WIDTH +
  CIRCLE_INITIAL_POSITION -
  (CIRCLE_DIAMETER / 2 - CIRCLE_INITIAL_POSITION / 2);

const ICON_WIDTH = 18;
const ICON_TOP_POSITION = 1;
const ICON_LEFT_POSITION = 26;

const Background = styled.div(
  ({ theme }) => css`
    position: absolute;
    top: -${BORDER_WIDTH}px;
    left: -${BORDER_WIDTH}px;
    height: ${TOGGLE_HEIGHT}px;
    width: ${TOGGLE_WIDTH}px;
    background-color: transparent;
    border-radius: ${theme.borders.radius.x_large};
    border: ${BORDER_WIDTH}px solid ${theme.colors.border.defaultNormal};
    pointer-events: none;
    transition: all 0.3s;
  `
);

const Circle = styled.span(
  ({ theme }) => css`
    pointer-events: none;

    :after {
      content: '';
      position: absolute;
      top: ${CIRCLE_INITIAL_POSITION}px;
      left: ${CIRCLE_INITIAL_POSITION}px;
      height: ${CIRCLE_DIAMETER}px;
      width: ${CIRCLE_DIAMETER}px;
      background-color: ${theme.colors.fg.secondary};
      border-radius: ${theme.borders.radius.round};
      cursor: pointer;
      transition: background-color 0.3s, border-color 0.3s, transform 0.15s;
    }
  `
);

const StyledCheckmark = styled(Checkmark)(
  ({ theme }) => css`
    position: absolute;
    width: ${ICON_WIDTH}px;
    top: ${ICON_TOP_POSITION}px;
    left: ${ICON_LEFT_POSITION}px;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.15s;
    pointer-events: none;
    color: ${theme.colors.standard.white};
  `
);

const ToggleContainer = styled.div(
  ({ theme }) => css`
    position: relative;
    height: ${TOGGLE_HEIGHT}px;
    width: ${TOGGLE_WIDTH}px;
    background-color: ${theme.colors.bg.primary};
    border-radius: ${theme.borders.radius.x_large};

    input[type='checkbox'] {
      position: absolute;
      top: -${BORDER_WIDTH / 2}px;
      left: -${BORDER_WIDTH / 2}px;
      height: ${TOGGLE_HEIGHT + BORDER_WIDTH}px;
      width: ${TOGGLE_WIDTH + BORDER_WIDTH}px;
      margin: 0;
      opacity: 0;
      cursor: pointer;

      :disabled {
        ~ ${Background} {
          border-color: ${theme.colors.fg.disable};
        }

        :checked ~ ${Background} {
          background-color: ${theme.colors.fg.disable};
          border-color: ${theme.colors.fg.disable};
        }

        ~ ${Circle}:after {
          background-color: ${theme.colors.fg.disable};
        }

        :checked ~ ${Circle}:after {
          background-color: ${theme.colors.bg.secondary};
        }

        ~ ${StyledCheckmark} path {
          fill: ${theme.colors.interactiveFg.disable};
        }
      }

      &.${FOCUS_VISIBLE_SELECTOR} {
        ~ ${Background} {
          outline: none;
          box-shadow: 0 0 0 5px ${theme.colors.bg.primary},
            0 0 0 7px ${theme.colors.border.focus};
        }
      }

      :checked {
        ~ ${Background} {
          background-color: ${theme.colors.interactiveBg.positivePress};
          border-color: ${theme.colors.interactiveBg.positivePress};
        }

        ~ ${Circle}:after {
          transform: translate3d(${CIRCLE_FINAL_POSITION}px, 0, 0);
          background-color: ${theme.colors.interactiveBg.positiveNormal};
        }

        ~ ${StyledCheckmark} {
          opacity: 1;
        }
      }

      :hover {
        :not(:disabled) ~ ${Background} {
          border-color: ${theme.colors.fg.secondary};
        }

        :checked:not(:disabled) ~ ${Background} {
          background-color: ${theme.colors.interactiveBg.positiveHover};
          border-color: ${theme.colors.interactiveBg.positiveHover};
        }
      }

      :active {
        ~ ${Background} {
          box-shadow: 0 0 0 8px ${theme.colors.shadow.active};
        }
      }
    }
  `
);

export const Toggle = (props) => {
  return (
    <ToggleContainer>
      <input type="checkbox" {...props} />
      <Background />
      <StyledCheckmark />
      <Circle />
    </ToggleContainer>
  );
};

Toggle.propTypes = {
  checked: propTypes.bool,
  disabled: propTypes.bool,
};
