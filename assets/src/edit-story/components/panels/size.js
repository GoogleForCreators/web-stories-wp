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
import { useEffect, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { InputGroup } from '../form';
import { dataPixels } from '../../units';
import { SimplePanel } from './panel';
import getCommonValue from './utils/getCommonValue';

function SizePanel({ selectedElements, onSetProperties }) {
  const width = getCommonValue(selectedElements, 'width');
  const height = getCommonValue(selectedElements, 'height');
  const isFill = getCommonValue(selectedElements, 'isFill');
  const [state, setState] = useState({ width, height });
  const [lockRatio, setLockRatio] = useState(true);
  useEffect(() => {
    setState({ width, height });
  }, [width, height]);
  const handleSubmit = (evt) => {
    onSetProperties(({ width: oldWidth, height: oldHeight }) => {
      let { width: newWidth, height: newHeight } = state;
      if (lockRatio && (newHeight === '' || newWidth === '')) {
        const ratio = oldWidth / oldHeight;
        if (newWidth === '') {
          newWidth = dataPixels(newHeight * ratio);
        } else {
          newHeight = dataPixels(newWidth / ratio);
        }
      }
      return { width: newWidth, height: newHeight };
    });
    evt.preventDefault();
  };
  return (
    <SimplePanel
      name="size"
      title={__('Size', 'web-stories')}
      onSubmit={handleSubmit}
    >
      <InputGroup
        label={__('Width', 'web-stories')}
        value={state.width}
        isMultiple={width === ''}
        onChange={(value) => {
          const ratio = width / height;
          const newWidth =
            isNaN(value) || value === '' ? '' : parseFloat(value);
          setState({
            ...state,
            width: newWidth,
            height:
              height !== '' && typeof newWidth === 'number' && lockRatio
                ? dataPixels(newWidth / ratio)
                : height,
          });
        }}
        postfix={_x('px', 'pixels, the measurement of size', 'web-stories')}
        disabled={isFill}
      />
      <InputGroup
        label={__('Height', 'web-stories')}
        value={state.height}
        isMultiple={height === ''}
        onChange={(value) => {
          const ratio = width / height;
          const newHeight =
            isNaN(value) || value === '' ? '' : parseFloat(value);
          setState({
            ...state,
            height: newHeight,
            width:
              width !== '' && typeof newHeight === 'number' && lockRatio
                ? dataPixels(newHeight * ratio)
                : width,
          });
        }}
        postfix={_x('px', 'pixels, the measurement of size', 'web-stories')}
        disabled={isFill}
      />
      <InputGroup
        type="checkbox"
        label={__('Keep ratio', 'web-stories')}
        value={lockRatio}
        isMultiple={false}
        onChange={(value) => {
          setLockRatio(value);
        }}
        disabled={isFill}
      />
    </SimplePanel>
  );
}

SizePanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default SizePanel;
