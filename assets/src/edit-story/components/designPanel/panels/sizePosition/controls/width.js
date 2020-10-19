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
import useUpdateWidth from './useUpdateWidth';

function Width() {
  const updateWidth = useUpdateWidth();

  return (
    <SimpleNumeric
      property={CONFIG.WIDTH.PROPERTY}
      suffix={_x('W', 'The width dimension', 'web-stories')}
      aria-label={__('Width', 'web-stories')}
      onChange={updateWidth}
    />
  );
}

export default Width;
