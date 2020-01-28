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
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Panel, Title, InputGroup, getCommonValue } from './shared';

function PositionPanel({ selectedElements, onSetProperties }) {
  const x = getCommonValue(selectedElements, 'x');
  const y = getCommonValue(selectedElements, 'y');
  const isFullbleed = getCommonValue(selectedElements, 'isFullbleed');
  const [state, setState] = useState({ x, y });
  useEffect(() => {
    setState({ x, y });
  }, [x, y]);
  const handleSubmit = (evt) => {
    onSetProperties(state);
    evt.preventDefault();
  };
  return (
    <Panel onSubmit={handleSubmit}>
      <Title>
        { __('Position', 'web-stories') }
      </Title>
      <InputGroup
        label={_x('X', 'The X axis', 'web-stories')}
        value={state.x}
        isMultiple={x === ''}
        onChange={(value) => setState({ ...state, x: isNaN(value) || value === '' ? '' : parseFloat(value) })}
        postfix={_x('px', 'pixels, the measurement of size', 'web-stories')}
        disabled={isFullbleed}
      />
      <InputGroup
        label={_x('Y', 'The Y axis', 'web-stories')}
        value={state.y}
        isMultiple={y === ''}
        onChange={(value) => setState({ ...state, y: isNaN(value) || value === '' ? '' : parseFloat(value) })}
        postfix={_x('px', 'pixels, the measurement of size', 'web-stories')}
        disabled={isFullbleed}
      />
    </Panel>
  );
}

PositionPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default PositionPanel;
