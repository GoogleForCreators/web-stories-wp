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
import PropTypes from 'prop-types'; // import styled from 'styled-components';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import getRandomNumber from '../../utils/getRandomNumber';

// should allow for radio or checkbox inputs or just handle for those
const PILL_TYPES = {
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
};

const PillLabel = styled.label``;
const PillInput = styled.input``;

const Pill = ({
  displayText,
  inputType = PILL_TYPES.CHECKBOX,
  isSelected,
  name,
  onClick,
  value,
  ...rest
}) => {
  const id = `${name}_${getRandomNumber()}`;
  return (
    <PillLabel htmlFor={id}>
      <PillInput
        type={inputType}
        id={id}
        name={name}
        onClick={(e) => onClick(e, value)}
        value={value}
        checked={isSelected}
        {...rest}
      />
      {displayText}
    </PillLabel>
  );
};

Pill.propTypes = {
  inputType: PropTypes.oneOf(Object.values(PILL_TYPES)),
  displayText: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
};

export default Pill;
