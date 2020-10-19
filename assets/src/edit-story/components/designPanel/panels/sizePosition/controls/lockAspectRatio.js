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
import { Lock, Unlock } from '../../../../../icons';
import { IconToggle } from '../../../parts/controls';
import CONFIG from '../config';
import useUpdateLockAspectRatio from './useUpdateLockAspectRatio';

function LockAspectRatio() {
  const updateLockAspectRatio = useUpdateLockAspectRatio();

  return (
    <IconToggle
      aria-label={__('Aspect ratio lock', 'web-stories')}
      title={__('Constrain proportions', 'web-stories')}
      icon={<Lock />}
      uncheckedIcon={<Unlock />}
      property={CONFIG.LOCKASPECTRATIO.PROPERTY}
      onChange={updateLockAspectRatio}
    />
  );
}

export default LockAspectRatio;
