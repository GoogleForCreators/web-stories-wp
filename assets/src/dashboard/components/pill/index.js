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
import { PILL_LABEL_TYPES, PILL_INPUT_TYPES } from '../../constants/components';

import { PillInput, PillContainer } from './components';

import DefaultPill from './defaultPill';
import FloatingPill from './floatingPill';
import ColorSwatch from './colorSwatch';

const Pill = ({
  children = null,
  inputType = PILL_INPUT_TYPES.CHECKBOX,
  labelType = PILL_LABEL_TYPES.DEFAULT,
  isSelected = false,
  name,
  onClick,
  value,
  hex,
  ...rest
}) => {
  const labelTypes = {
    [PILL_LABEL_TYPES.FLOATING]: FloatingPill,
    [PILL_LABEL_TYPES.SWATCH]: ColorSwatch,
    [PILL_LABEL_TYPES.DEFAULT]: DefaultPill,
  };
  const Label = labelTypes[labelType];
  return (
    <PillContainer isSelected={isSelected}>
      <PillInput
        type={inputType}
        name={name}
        onChange={(e) => {
          onClick(e, value);
        }}
        value={value}
        checked={isSelected}
        {...rest}
      />
      <Label hex={hex} isSelected={isSelected} aria-hidden={true}>
        {labelType !== PILL_LABEL_TYPES.SWATCH && children}
      </Label>
    </PillContainer>
  );
};

Pill.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
  inputType: PropTypes.oneOf(Object.values(PILL_INPUT_TYPES)),
  labelType: PropTypes.oneOf(Object.values(PILL_LABEL_TYPES)),
  hex: PropTypes.string,
  isSelected: PropTypes.bool,
};

export default Pill;
