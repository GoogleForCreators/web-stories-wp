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
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { OffsetVertical } from '../../../../icons';
import { GrowNumeric } from '../../parts/inputs';
import CONFIG from './config';
import useUpdateLineHeight from './useUpdateLineHeight';
import useSetup from './useSetup';

function LineHeight() {
  useSetup();

  const updateLineHeight = useUpdateLineHeight();

  return (
    <GrowNumeric
      property={CONFIG.LINEHEIGHT.PROPERTY}
      aria-label={__('Line-height', 'web-stories')}
      float
      suffix={<OffsetVertical />}
      canBeEmpty
      onChange={updateLineHeight}
    />
  );
}

export default LineHeight;
