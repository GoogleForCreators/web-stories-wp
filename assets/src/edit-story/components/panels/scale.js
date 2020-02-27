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
import { useEffect, useState, useCallback } from '@wordpress/element';
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { InputGroup } from '../form';
import { SimplePanel } from './panel';
import getCommonValue from './utils/getCommonValue';

function ScalePanel({ selectedElements, onSetProperties }) {
  const scale = getCommonValue(selectedElements, 'scale');
  const focalX = getCommonValue(selectedElements, 'focalX');
  const focalY = getCommonValue(selectedElements, 'focalY');
  const [state, setState] = useState({ scale, focalX, focalY });
  useEffect(() => {
    setState({ scale, focalX, focalY });
  }, [scale, focalX, focalY]);
  const handleSubmit = (evt) => {
    onSetProperties({
      scale: typeof state.scale === 'string' ? null : state.scale,
      focalX: typeof state.focalX === 'string' ? null : state.focalX,
      focalY: typeof state.focalY === 'string' ? null : state.focalY,
    });
    evt.preventDefault();
  };

  const handleFloatChange = useCallback(
    (property) => (value) =>
      setState({
        ...state,
        [property]: isNaN(value) || value === '' ? '(auto)' : parseFloat(value),
      }),
    [setState, state]
  );

  return (
    <SimplePanel
      name="scale"
      title={__('Image actual size', 'web-stories')}
      onSubmit={handleSubmit}
    >
      <InputGroup
        label={__('Scale', 'web-stories')}
        value={typeof state.scale === 'number' ? state.scale : '(auto)'}
        isMultiple={scale === ''}
        onChange={handleFloatChange('scale')}
        postfix={_x('%', 'Percentage', 'web-stories')}
      />
      <InputGroup
        label={__('Focal X', 'web-stories')}
        value={typeof state.focalX === 'number' ? state.focalX : '(auto)'}
        isMultiple={focalX === ''}
        onChange={handleFloatChange('focalX')}
        postfix={_x('%', 'Percentage', 'web-stories')}
      />
      <InputGroup
        label={__('Focal Y', 'web-stories')}
        value={typeof state.focalY === 'number' ? state.focalY : '(auto)'}
        isMultiple={focalY === ''}
        onChange={handleFloatChange('focalY')}
        postfix={_x('%', 'Percentage', 'web-stories')}
      />
    </SimplePanel>
  );
}

ScalePanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default ScalePanel;
