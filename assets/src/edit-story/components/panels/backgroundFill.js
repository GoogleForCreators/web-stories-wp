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
import { SimplePanel } from './panel';

function BackgroundFillPanel({ selectedElements, onSetProperties }) {
  const { backgroundFill } = selectedElements[0];

  const handleChange = (evt) => {
    onSetProperties({
      isFullbleedBackground: evt.target.value === 'yes',
    });
  };

  return (
    <SimplePanel
      name="backgroundFill"
      title={__('Background Fill Behavior', 'amp')}
    >
      <select
        value={backgroundFill}
        onChange={handleChange}
        onBlur={(evt) =>
          evt.target.form.dispatchEvent(new window.Event('submit'))
        }
      >
        <option value="yes">{__('Fit to device', 'web-stories')}</option>
        <option value="no">{__('Do not format', 'web-stories')}</option>
      </select>
    </SimplePanel>
  );
}

BackgroundFillPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default BackgroundFillPanel;
