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
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import { DIRECTION } from '../../../../animation';

const Svg = styled.svg`
  display: block;
  height: 10px;
  width: 10px;
  fill: none;
  transform-origin: 50% 50%;
`;

const Icon = styled.div`
  padding: 4px;
  transform: rotate(
    ${({ direction }) => {
      switch (direction) {
        case DIRECTION.RIGHT_TO_LEFT:
          return '270deg';
        case DIRECTION.TOP_TO_BOTTOM:
          return '180deg';
        case DIRECTION.LEFT_TO_RIGHT:
          return '90deg';
        default:
          return '0deg';
      }
    }}
  );
`;

const Direction = ({ className, direction }) => (
  <Icon className={className} direction={direction}>
    <Svg viewBox="0 0 10 11">
      <path d="M5 11L5 1M5 1L9 5M5 1L1 5" />
    </Svg>
  </Icon>
);

Direction.propTypes = {
  className: PropTypes.string,
  direction: PropTypes.oneOf(Object.values(DIRECTION)),
};

// Must be a styled component to add component selectors in css
const DirectionIndicator = styled(Direction)``;

const Fieldset = styled.fieldset`
  position: relative;
  height: 63px;
  width: 63px;
  background-color: ${({ theme }) => theme.colors.bg.workspace};
  border: 1px solid ${({ theme }) => theme.colors.fg.v9};
  border-radius: 4px;
`;

const Figure = styled.div`
  position: absolute;
  display: block;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 26px;
  background: ${({ theme }) => theme.colors.fg.v9};
  border-radius: 2px;
  transform: translate(-50%, -50%);
`;

const Label = styled.label`
  position: absolute;
  cursor: pointer;

  ${({ direction }) => {
    switch (direction) {
      case DIRECTION.RIGHT_TO_LEFT:
        return css`
          top: 50%;
          right: 0;
          transform: translateY(-50%);
        `;
      case DIRECTION.TOP_TO_BOTTOM:
        return css`
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        `;
      case DIRECTION.LEFT_TO_RIGHT:
        return css`
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        `;
      default:
        return css`
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        `;
    }
  }}

  ${DirectionIndicator} {
    stroke: ${({ theme }) => theme.colors.fg.v9};
    stroke-width: 1px;
  }

  input:checked ~ ${DirectionIndicator} {
    stroke: ${({ theme }) => theme.colors.activeDirection};
    stroke-width: 2px;
  }

  input:focus ~ ${DirectionIndicator} {
    outline: 2px auto ${({ theme }) => theme.colors.accent.primary};
  }
`;

const hidden = css`
  position: absolute;
  opacity: 0;
  clip-path: polygon(0 0);
  cursor: pointer;
`;
const HiddenLegend = styled.legend`
  ${hidden}
`;
const HiddenInput = styled.input`
  ${hidden}
`;

const RadioGroup = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const camelToPascal = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

const pascalToSentence = (string) => string.replace(/([a-z])([A-Z])/g, '$1 $2');

export const DirectionRadioInput = ({
  directions = [],
  onChange,
  defaultChecked,
}) => {
  return (
    <Fieldset>
      <Figure />
      <HiddenLegend>{__('Which Direction?', 'web-stories')}</HiddenLegend>
      <RadioGroup>
        {directions.map((direction) => (
          <Label
            key={direction}
            aria-label={sprintf(
              /* translators: %s: Direction, for example 'top' or 'left'. */
              __('%s Direction', 'web-stories'),
              pascalToSentence(camelToPascal(direction))
            )}
            htmlFor={direction}
            direction={direction}
          >
            <HiddenInput
              id={direction}
              type="radio"
              name="direction"
              value={direction}
              onChange={onChange}
              defaultChecked={defaultChecked === direction}
            />
            <DirectionIndicator direction={direction} />
          </Label>
        ))}
      </RadioGroup>
    </Fieldset>
  );
};

DirectionRadioInput.propTypes = {
  defaultChecked: PropTypes.oneOf(Object.values(DIRECTION)),
  directions: PropTypes.arrayOf(PropTypes.oneOf(Object.values(DIRECTION))),
  onChange: PropTypes.func,
};
