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
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { InputGroup } from '../../form';

function BackgroundColorControls({ properties, state, setState }) {
  const { backgroundColor, backgroundOpacity } = properties;
  return (
    <>
      <InputGroup
        type="color"
        label={__('Background color', 'web-stories')}
        value={state.backgroundColor}
        isMultiple={backgroundColor === ''}
        onChange={(value) => setState({ ...state, backgroundColor: value })}
      />
      <InputGroup
        type="number"
        label={__('Background Opacity', 'web-stories')}
        value={state.backgroundOpacity}
        isMultiple={'' === backgroundOpacity}
        onChange={(value) => setState({ ...state, backgroundOpacity: value })}
        postfix={_x('%', 'Percentage', 'web-stories')}
        min="1"
        max="100"
      />
    </>
  );
}

BackgroundColorControls.propTypes = {
  properties: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
};

export default BackgroundColorControls;
