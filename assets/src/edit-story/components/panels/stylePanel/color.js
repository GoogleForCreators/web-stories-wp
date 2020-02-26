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
import BackgroundColorControls from '../shared/backgroundColorControls';

function ColorControls({ properties, state, setState }) {
  const { color, backgroundColor, backgroundOpacity, textOpacity } = properties;
  return (
    <>
      <InputGroup
        type="color"
        label={__('Color', 'web-stories')}
        value={state.color}
        isMultiple={color === ''}
        onChange={(value) => setState({ ...state, color: value })}
      />
      <InputGroup
        type="number"
        label={__('Text Opacity', 'web-stories')}
        value={state.textOpacity}
        isMultiple={'' === textOpacity}
        onChange={(value) => setState({ ...state, textOpacity: value })}
        postfix={_x('%', 'Percentage', 'web-stories')}
        min="1"
        max="100"
      />
      <BackgroundColorControls
        state={state}
        setState={setState}
        properties={{ backgroundColor, backgroundOpacity }}
      />
    </>
  );
}

ColorControls.propTypes = {
  properties: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
};

export default ColorControls;
