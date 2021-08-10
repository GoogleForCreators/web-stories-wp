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

/**
 * WordPress dependencies
 */
import { ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { updateViewSettings } from '../../utils';

/**
 * Toggle component for TinyMCE popup.
 *
 * @param {Object} props Component props.
 * @return {*} React component.
 */
const TinyMceToggle = (props) => {
  const { fieldObj = {}, field } = props;
  const { show, hidden, label } = fieldObj;

  if (hidden) {
    return null;
  }

  return (
    <ToggleControl
      label={label}
      checked={show}
      onChange={() => {
        updateViewSettings({
          fieldObj: fieldObj,
          field: field,
          hidden,
        });
      }}
    />
  );
};

TinyMceToggle.propTypes = {
  fieldObj: PropTypes.shape({
    show: PropTypes.bool,
    label: PropTypes.string,
    hidden: PropTypes.bool,
  }),
  field: PropTypes.string,
};

export default TinyMceToggle;
