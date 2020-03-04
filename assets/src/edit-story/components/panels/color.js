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
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Color } from '../form';
import { SimplePanel } from './panel';
import getCommonValue from './utils/getCommonValue';

function ColorPanel({ selectedElements, onSetProperties }) {
  const color = getCommonValue(selectedElements, 'color');
  const [state, setState] = useState({ color });
  useEffect(() => {
    setState({ color });
  }, [color]);
  const handleSubmit = (evt) => {
    onSetProperties(state);
    evt.preventDefault();
  };
  return (
    <SimplePanel
      name="color"
      title={__('Color', 'web-stories')}
      onSubmit={handleSubmit}
    >
      <Color
        label={__('Color', 'web-stories')}
        value={state.color}
        isMultiple={color === ''}
        onChange={(value) => setState({ ...state, color: value })}
      />
    </SimplePanel>
  );
}

ColorPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default ColorPanel;
