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
 * Internal dependencies
 */
import { ReactComponent as FlipHorizontal } from '../../../icons/flip_horizontal.svg';
import { ReactComponent as FlipVertical } from '../../../icons/flip_vertical.svg';
import Toggle from '../../form/toggle';

function FlipControls({ value, onChange }) {
  return (
    <>
      <Toggle
        icon={<FlipHorizontal />}
        value={value.horizontal}
        onChange={(horizontal) => {
          onChange({ ...value, horizontal });
        }}
      />
      <Toggle
        icon={<FlipVertical />}
        value={value.vertical}
        onChange={(vertical) => {
          onChange({ ...value, vertical });
        }}
      />
    </>
  );
}

FlipControls.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FlipControls;
