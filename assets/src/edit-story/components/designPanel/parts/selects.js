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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import FontPickerDropdown from '../../fontPicker';
import DropDown from '../../form/dropDown';
import useSetupFor from '../useSetupFor';

export function FontPicker({ property, ...rest }) {
  const { value, options } = useSetupFor(property);
  return <FontPickerDropdown options={options} value={value} {...rest} />;
}

FontPicker.propTypes = {
  property: PropTypes.string.isRequired,
};

export function Select({ property, ...rest }) {
  const { value, options } = useSetupFor(property);
  return (
    <DropDown
      options={options}
      value={value}
      placeholder={__('(multiple)', 'web-stories')}
      {...rest}
    />
  );
}

Select.propTypes = {
  property: PropTypes.string.isRequired,
};
