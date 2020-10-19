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
import { SimpleNumeric } from '../../../parts/controls';
import CONFIG from '../config';
import useUpdateHeight from './useUpdateHeight';

function Height() {
  const updateHeight = useUpdateHeight();

  return (
    <SimpleNumeric
      property={CONFIG.HEIGHT.PROPERTY}
      suffix={_x('H', 'The height dimension', 'web-stories')}
      aria-label={__('Height', 'web-stories')}
      onChange={updateHeight}
    />
  );
}

export default Height;
