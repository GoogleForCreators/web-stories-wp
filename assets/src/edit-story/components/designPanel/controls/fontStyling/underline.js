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
import { Underline as UnderlineIcon } from '../../../../icons';
import { StateToggle } from '../../parts/toggles';
import CONFIG from './config';
import useUpdateUnderline from './useUpdateUnderline';

function Underline() {
  const updateUnderline = useUpdateUnderline();

  return (
    <StateToggle
      property={CONFIG.UNDERLINE.PROPERTY}
      aria-label={__('Toggle: underline', 'web-stories')}
      onChange={updateUnderline}
      icon={<UnderlineIcon />}
      iconWidth={9}
      iconHeight={10}
    />
  );
}

export default Underline;
