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
import { FlipHorizontal, FlipVertical } from '../../../../icons';
import { StateToggle } from '../../parts/toggles';
import CONFIG from './config';
import useUpdateFlip from './useUpdateFlip';

export function Horizontal() {
  const { updateHorizontal } = useUpdateFlip();
  return (
    <StateToggle
      onChange={updateHorizontal}
      property={CONFIG.FLIPHORIZONTAL.PROPERTY}
      icon={<FlipHorizontal />}
      title={__('Flip vertically', 'web-stories')}
      aria-label={__('Flip vertically', 'web-stories')}
    />
  );
}

export function Vertical() {
  const { updateVertical } = useUpdateFlip();
  return (
    <StateToggle
      onChange={updateVertical}
      property={CONFIG.FLIPVERTICAL.PROPERTY}
      icon={<FlipVertical />}
      title={__('Flip horizontally', 'web-stories')}
      aria-label={__('Flip horizontally', 'web-stories')}
    />
  );
}
