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
import { v4 as uuidv4 } from 'uuid';
import { rgba } from 'polished';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { FIELD_TYPES } from '../../../../animation/constants';
import { GeneralAnimationPropTypes } from '../../../../animation/outputs/types';
import { AnimationFormPropTypes } from '../../../../animation/types';
import { DropDown, BoxedNumeric } from '../../form';
import RangeInput from '../../rangeInput';

const RangeContainer = styled.div`
  width: 100%;
`;

const Label = styled.label`
  display: block;
  color: ${({ theme }) => rgba(theme.colors.fg.white, 0.3)};
  font-family: ${({ theme }) => theme.fonts.body2.family};
  font-size: ${({ theme }) => theme.fonts.body2.size};
  line-height: ${({ theme }) => theme.fonts.body2.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body2.letterSpacing};
`;

function EffectInput({ effectProps, effectConfig, field, onChange }) {
  const rangeId = `range-${uuidv4()}`;
  switch (effectProps[field].type) {
    case FIELD_TYPES.DROPDOWN:
      return (
        <DropDown
          value={effectConfig[field] || effectProps[field].defaultValue}
          onChange={(value) => onChange(value, true)}
          options={effectProps[field].values.map((v) => ({
            value: v,
            name: v,
          }))}
        />
      );
    case FIELD_TYPES.RANGE:
      return (
        <RangeContainer>
          <Label htmlFor={rangeId}>{effectProps[field].label}</Label>
          <RangeInput
            id={rangeId}
            aria-label={effectProps[field].label}
            value={effectConfig[field] || effectProps[field].defaultValue}
            handleChange={(value) => onChange(value, true)}
            minorStep={0.01}
            majorStep={0.1}
            min={0}
            max={1}
            style={{ width: '100%' }}
          />
        </RangeContainer>
      );
    default:
      return (
        <BoxedNumeric
          aria-label={effectProps[field].label}
          suffix={effectProps[field].label}
          symbol={effectProps[field].unit}
          value={effectConfig[field] || effectProps[field].defaultValue}
          min={0}
          onChange={onChange}
          canBeNegative={false}
          float={effectProps[field].type === FIELD_TYPES.FLOAT}
          flexBasis={'100%'}
        />
      );
  }
}

EffectInput.propTypes = {
  effectProps: AnimationFormPropTypes.isRequired,
  effectConfig: PropTypes.shape(GeneralAnimationPropTypes).isRequired,
  field: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default EffectInput;
