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
import { dataPixels } from '../../../units';

function PaddingControls({
  properties,
  state,
  setState,
  setLockPaddingRatio,
  lockPaddingRatio,
  getPaddingRatio,
}) {
  const { padding } = properties;
  return (
    <>
      <InputGroup
        label={__('Padding Horizontal', 'web-stories')}
        value={state.padding.horizontal}
        isMultiple={'' === padding}
        onChange={(value) => {
          const ratio = getPaddingRatio(padding.horizontal, padding.vertical);
          const newPadding = {
            horizontal:
              isNaN(value) || '' === value ? '' : dataPixels(parseInt(value)),
          };
          newPadding.vertical =
            typeof padding.horizontal === 'number' && lockPaddingRatio && ratio
              ? Math.round(dataPixels(parseInt(newPadding.horizontal)) / ratio)
              : padding.vertical;
          setState({ ...state, padding: newPadding });
        }}
        postfix={_x('px', 'pixels, the measurement of size', 'web-stories')}
      />
      <InputGroup
        label={__('Padding Vertical', 'web-stories')}
        value={state.padding.vertical}
        isMultiple={'' === padding}
        onChange={(value) => {
          const ratio = getPaddingRatio(padding.horizontal, padding.vertical);
          const newPadding = {
            vertical:
              isNaN(value) || '' === value ? '' : dataPixels(parseInt(value)),
          };
          newPadding.horizontal =
            padding.horizontal !== '' &&
            typeof padding.vertical === 'number' &&
            lockPaddingRatio &&
            ratio
              ? Math.round(dataPixels(parseInt(newPadding.vertical)) / ratio)
              : padding.horizontal;
          setState({ ...state, padding: newPadding });
        }}
        postfix={_x('px', 'pixels, the measurement of size', 'web-stories')}
      />
      <InputGroup
        type="checkbox"
        label={__('Keep padding ratio', 'web-stories')}
        value={lockPaddingRatio}
        onChange={setLockPaddingRatio}
      />
    </>
  );
}

PaddingControls.propTypes = {
  properties: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
  setLockPaddingRatio: PropTypes.func.isRequired,
  lockPaddingRatio: PropTypes.bool.isRequired,
  getPaddingRatio: PropTypes.func.isRequired,
};

export default PaddingControls;
