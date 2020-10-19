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
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SimpleNumeric } from '../../../parts/inputs';
import CONFIG from '../config';
import useUpdateRotation from './useUpdateRotation';

function Rotation() {
  const updateRotation = useUpdateRotation();

  return (
    <SimpleNumeric
      property={CONFIG.ROTATION.PROPERTY}
      suffix={__('Rotate', 'web-stories')}
      symbol={_x('°', 'Degrees, 0 - 360. ', 'web-stories')}
      aria-label={__('Rotation', 'web-stories')}
      canBeNegative
      onChange={updateRotation}
    />
  );
}

export default Rotation;
