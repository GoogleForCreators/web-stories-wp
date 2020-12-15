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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { FillNone, FillFilled, FillHighlighted } from '../../../../icons';
import { StateToggle } from '../../parts/toggles';
import CONFIG from './config';
import useUpdateBackgroundMode from './useUpdateBackgroundMode';

function BackgroundMode({ value, ...rest }) {
  const updateBackgroundMode = useUpdateBackgroundMode();

  return (
    <StateToggle
      property={CONFIG.BACKGROUNDMODE.PROPERTY}
      value={value}
      onChange={updateBackgroundMode(value)}
      {...rest}
    />
  );
}

BackgroundMode.propTypes = {
  value: PropTypes.string.isRequired,
};

export function None() {
  return (
    <BackgroundMode
      value={CONFIG.BACKGROUNDMODE.OPTIONS.NONE}
      icon={<FillNone />}
      aria-label={__('Set text background mode: None', 'web-stories')}
    />
  );
}

export function Fill() {
  return (
    <BackgroundMode
      value={CONFIG.BACKGROUNDMODE.OPTIONS.FILL}
      icon={<FillFilled />}
      aria-label={__('Set text background mode: Fill', 'web-stories')}
    />
  );
}

export function Highlight() {
  return (
    <BackgroundMode
      value={CONFIG.BACKGROUNDMODE.OPTIONS.HIGHLIGHT}
      icon={<FillHighlighted />}
      aria-label={__('Set text background mode: Highlight', 'web-stories')}
    />
  );
}
