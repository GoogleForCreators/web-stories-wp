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
import {
  OverlayNone,
  OverlaySolid,
  OverlayLinear,
  OverlayRadial,
} from '../icons/';
import generatePatternStyles from './generatePatternStyles';

export const OverlayType = {
  NONE: 'none',
  SOLID: 'solid',
  LINEAR: 'linear',
  RADIAL: 'radial',
};

export const OverlayPreset = {
  [OverlayType.NONE]: {
    label: __('None', 'web-stories'),
    icon: <OverlayNone />,
  },
  [OverlayType.SOLID]: {
    label: __('Solid', 'web-stories'),
    icon: <OverlaySolid />,
  },
  [OverlayType.LINEAR]: {
    label: __('Linear', 'web-stories'),
    icon: <OverlayLinear />,
  },
  [OverlayType.RADIAL]: {
    label: __('Radial', 'web-stories'),
    icon: <OverlayRadial />,
  },
};

/**
 * Generate CSS styles for background overlay types.
 *
 * @param {OverlayType} type Type of the background overlay
 * @return {Object} CSS declaration as object.
 */
export function generateOverlayStyles(type = OverlayType.NONE) {
  if (type === OverlayType.NONE) {
    return { background: 'none' };
  }
  return generatePatternStyles({
    type,
    color: { r: 0, g: 0, b: 0, a: 0.3 },
    rotation: 0.5,
    stops:
      type === 'radial'
        ? [
            { color: { r: 0, g: 0, b: 0, a: 0 }, position: 0.3 },
            { color: { r: 0, g: 0, b: 0, a: 0.8 }, position: 0.8 },
          ]
        : [
            { color: { r: 0, g: 0, b: 0, a: 0.9 }, position: 0 },
            { color: { r: 0, g: 0, b: 0, a: 0 }, position: 0.6 },
          ],
  });
}
