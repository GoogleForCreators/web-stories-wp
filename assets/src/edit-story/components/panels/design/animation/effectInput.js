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
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import styled, { css } from 'styled-components';

/**
 * Internal dependencies
 */
import { __ } from '@web-stories-wp/i18n';
import { FIELD_TYPES } from '../../../../../animation';
import { GeneralAnimationPropTypes } from '../../../../../animation/outputs';
import { AnimationFormPropTypes } from '../../../../../animation/types';
import RangeInput from '../../../rangeInput';
import {
  NumericInput,
  DropDown,
} from '../../../../../design-system/components';
import {
  THEME_CONSTANTS,
  Text,
  ThemeGlobals,
} from '../../../../../design-system';
import { DirectionRadioInput } from './directionRadioInput';
import { INPUT_HEIGHT } from './constants';

const RangeContainer = styled.div`
  width: 100%;
`;

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
    &.${ThemeGlobals.FOCUS_VISIBLE_SELECTOR}, &[data-focus-visible-added] {
      border-radius: ${({ theme }) => theme.borders.radius.small};
    }
  }
`;

const StyledText = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.primary};
`;

const Label = styled.label`
  display: block;
`;

function EffectInput({
  effectProps,
  effectConfig,
  field,
  onChange,
  disabledOptions,
  tooltip,
}) {
  const rangeId = `range-${uuidv4()}`;

  const directionControlOnChange = useCallback(
    (value) => onChange(value, true),
    [onChange]
  );

  const valueForField = effectConfig[field] || effectProps[field].defaultValue;
  switch (effectProps[field].type) {
    case FIELD_TYPES.DROPDOWN:
      return (
        <StyledDropDown
          options={(effectProps[field].values || []).map(
            ({ name, ...rest }) => ({
              ...rest,
              label: name,
              disabled: disabledOptions.includes(rest.value),
            })
          )}
          placeholder={__('Select a value', 'web-stories')}
          ariaLabel={__('Select effect value', 'web-stories')}
          isKeepMenuOpenOnSelection={false}
          selectedValue={valueForField}
          onMenuItemClick={(evt) => onChange(evt.target.value, true)}
        />
      );
    case FIELD_TYPES.DIRECTION_PICKER:
      return (
        <DirectionRadioInput
          value={valueForField}
          directions={effectProps[field].values}
          onChange={directionControlOnChange}
          disabled={disabledOptions}
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
          onChange={onChange}
          isFloat={effectProps[field].type === FIELD_TYPES.FLOAT}
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
  tooltip: PropTypes.string,
};

export default EffectInput;
