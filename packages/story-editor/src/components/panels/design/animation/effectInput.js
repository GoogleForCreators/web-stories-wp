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
import { useMemo, useCallback } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { __ } from '@googleforcreators/i18n';
import {
  NumericInput,
  DropDown,
  ThemeGlobals,
} from '@googleforcreators/design-system';
import {
  FIELD_TYPES,
  DIRECTION,
  ROTATION,
  SCALE_DIRECTION,
  GeneralAnimationPropTypes,
  AnimationFormPropTypes,
} from '@googleforcreators/animation';
/**
 * Internal dependencies
 */
import { inputContainerStyleOverride } from '../../shared/styles';
import { DirectionRadioInput } from './directionRadioInput';
import { INPUT_HEIGHT } from './constants';

const outerGridBordersCss = css`
  border-radius: 0;
  border-color: ${({ theme }) => theme.colors.border.defaultNormal} transparent
    transparent transparent;
`;

const StyledInput = styled(NumericInput)`
  height: ${INPUT_HEIGHT}px;
  div {
    height: calc(100% + 1px);
    ${outerGridBordersCss}
    &:focus-within {
      border-radius: ${({ theme }) => theme.borders.radius.small};
    }
  }
`;

const StyledDropDown = styled(DropDown)`
  button {
    height: 46px;
    ${outerGridBordersCss}
    &:hover {
      ${outerGridBordersCss}
    }
    &.${ThemeGlobals.FOCUS_VISIBLE_SELECTOR}, &[${ThemeGlobals.FOCUS_VISIBLE_DATA_ATTRIBUTE}] {
      border-radius: ${({ theme }) => theme.borders.radius.small};
    }
  }
`;

function EffectInput({
  effectProps,
  effectConfig,
  field,
  onChange,
  disabledOptions,
  disabled = false,
  tooltip,
}) {
  const directionControlOnChange = useCallback(
    (value) => onChange(value, true),
    [onChange]
  );

  const options = useMemo(() => {
    return disabled
      ? [
          ...Object.values(DIRECTION),
          ...Object.values(ROTATION),
          ...Object.values(SCALE_DIRECTION),
        ]
      : disabledOptions;
  }, [disabledOptions, disabled]);

  const valueForField = effectConfig[field] ?? effectProps[field].defaultValue;
  const isFloat = effectProps[field].type === FIELD_TYPES.FLOAT;
  switch (effectProps[field].type) {
    case FIELD_TYPES.DROPDOWN:
      return (
        <StyledDropDown
          options={(effectProps[field].values || []).map(
            ({ name, ...rest }) => ({
              ...rest,
              label: name,
              disabled: options.includes(rest.value),
            })
          )}
          placeholder={__('Select a value', 'web-stories')}
          ariaLabel={__('Select effect value', 'web-stories')}
          isKeepMenuOpenOnSelection={false}
          selectedValue={valueForField}
          onMenuItemClick={(evt) => onChange(evt.target.value, true)}
          disabled={disabled}
        />
      );
    case FIELD_TYPES.DIRECTION_PICKER:
      return (
        <DirectionRadioInput
          value={valueForField}
          directions={effectProps[field].values}
          onChange={directionControlOnChange}
          disabled={options}
          tooltip={tooltip}
        />
      );
    default:
      return (
        <StyledInput
          aria-label={effectProps[field].label}
          suffix={effectProps[field].label}
          unit={effectProps[field].unit}
          value={valueForField}
          min={0}
          onChange={(evt) =>
            onChange(
              isFloat
                ? parseFloat(evt.target.value)
                : parseInt(evt.target.value),
              true
            )
          }
          isFloat={isFloat}
          containerStyleOverride={inputContainerStyleOverride}
          disabled={disabled}
        />
      );
  }
}

EffectInput.propTypes = {
  effectProps: AnimationFormPropTypes.isRequired,
  effectConfig: PropTypes.shape(GeneralAnimationPropTypes).isRequired,
  field: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabledOptions: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  tooltip: PropTypes.string,
};

export default EffectInput;
