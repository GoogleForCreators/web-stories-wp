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
import { MASKS } from '../../masks';
import { SimplePanel } from './panel';
import getCommonValue from './utils/getCommonValue';

/* eslint-disable jsx-a11y/no-onchange */
function MaskPanel({ selectedElements, onSetProperties }) {
  const masks = selectedElements.map(({ mask }) => mask);
  const type = masks.some((mask) => !mask) ? '' : getCommonValue(masks, 'type');
  const mask = MASKS.find((aMask) => aMask.type === type);

  const onTypeChanged = (evt) => {
    const newType = evt.target.value;
    if (newType === '') {
      onSetProperties({ mask: null });
    } else {
      const newMask = MASKS.find((aMask) => aMask.type === newType);
      onSetProperties({
        mask: {
          type: newType,
          ...newMask.defaultProps,
        },
      });
    }
  };

  return (
    <SimplePanel name="mask" title={__('Mask', 'web-stories')}>
      <select value={type} onChange={onTypeChanged}>
        <option key={'none'} value={''}>
          {'None'}
        </option>
        {MASKS.map(({ type: aType, name }) => (
          <option key={aType} value={aType}>
            {name}
          </option>
        ))}
      </select>
      <div>
        {mask && (
          <svg width={50} height={50} viewBox="0 0 1 1">
            <g transform="scale(0.8)" transform-origin="50% 50%">
              <path
                d={mask.path}
                fill="none"
                stroke="blue"
                strokeWidth={2 / 50}
              />
            </g>
          </svg>
        )}
      </div>
    </SimplePanel>
  );
}
/* eslint-enable jsx-a11y/no-onchange */

MaskPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default MaskPanel;
