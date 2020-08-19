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

/**
 * Internal dependencies
 */
import { FIELD_TYPES } from '../../../../animation/constants';
import { GeneralAnimationPropTypes } from '../../../../animation/outputs/types';
import { AnimationFormPropTypes } from '../../../../animation/types';
import { DropDown, BoxedNumeric } from '../../form';

function EffectInput({ effectProps, effectConfig, field, onChange }) {
  switch (effectProps[field].type) {
    case FIELD_TYPES.DROPDOWN:
      return (
        <DropDown
          value={effectConfig[field] || effectProps[field].defaultValue}
          onChange={onChange}
          options={effectProps[field].values.map((v) => ({
            value: v,
            name: v,
          }))}
        />
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
