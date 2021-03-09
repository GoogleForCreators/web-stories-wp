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
import PropTypes from 'prop-types';
import { useMemo, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
/**
 * Internal dependencies
 */
import { Radio } from './radio';
/**
 * Internal dependencies
 */
import useRadioNavigation from './useRadioNavigation';

export function RadioGroup({
  className,
  id,
  options,
  value: selectedValue,
  ...radioButtonProps
}) {
  const groupRef = useRef(null);
  const radioGroupId = useMemo(() => id || uuidv4(), [id]);

  useRadioNavigation(groupRef);

  return (
    <div ref={groupRef} className={className}>
      {options.map(({ helper, name, value }, index) => (
        <Radio
          key={value}
          name={name}
          value={value}
          checked={value === selectedValue}
          hint={helper}
          aria-labelledby={`radio-${index}-${radioGroupId}`}
          {...radioButtonProps}
        />
      ))}
    </div>
  );
}
RadioGroup.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      helper: PropTypes.string,
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
};
