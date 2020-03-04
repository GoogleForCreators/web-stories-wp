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
import { useCallback } from 'react';

/**
 * Internal dependencies
 */
import { ReactComponent as FlipHorizontal } from '../../../icons/flip_horizontal.svg';
import { ReactComponent as FlipVertical } from '../../../icons/flip_vertical.svg';
import Toggle from '../../form/toggle';

function FlipControls({ state, setState }) {
  const handleFlipChange = useCallback(
    (property) => (value) => {
      setState({
        ...state,
        flip: {
          ...state.flip,
          [property]: value,
        },
      });
    },
    [setState, state]
  );
  return (
    <>
      <Toggle
        icon={<FlipHorizontal />}
        value={state.flip?.horizontal}
        onChange={handleFlipChange('horizontal')}
      />
      <Toggle
        icon={<FlipVertical />}
        value={state.flip?.vertical}
        onChange={handleFlipChange('vertical')}
      />
    </>
  );
}

FlipControls.propTypes = {
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
};

export default FlipControls;
