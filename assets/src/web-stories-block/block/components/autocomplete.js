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
 * WordPress dependencies
 */
import { FormTokenField } from '@wordpress/components';

/**
 * External dependencies
 */
import PropTypes from 'prop-types';

const Autocomplete = ({
  label,
  value,
  onChange,
  onInputChange,
  placeholder,
  options = [],
}) => {
  // Return the block, but only if options were passed in.
  return (
    'undefined' !== typeof options &&
    '' !== options && (
      <div className="components-base-control">
        <FormTokenField
          value={value}
          suggestions={options}
          onChange={onChange}
          onInputChange={onInputChange}
          maxSuggestions={100}
          label={label}
          placeholder={placeholder}
        />
      </div>
    )
  );
};

Autocomplete.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  options: PropTypes.array.isRequired,
};

export default Autocomplete;
