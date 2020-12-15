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
import {
  AlignLeftAlt,
  AlignCenterAlt,
  AlignMiddleAlt,
  AlignRightAlt,
} from '../../../../icons';
import { StateToggle } from '../../parts/toggles';
import CONFIG from './config';
import useUpdateAlignment from './useUpdateAlignment';

function Alignment({ value, ...rest }) {
  const updateAlignment = useUpdateAlignment();

  return (
    <StateToggle
      property={CONFIG.TEXTALIGN.PROPERTY}
      value={value}
      onChange={updateAlignment(value)}
      {...rest}
    />
  );
}

Alignment.propTypes = {
  value: PropTypes.string.isRequired,
};

export function Left() {
  return (
    <Alignment
      value={CONFIG.TEXTALIGN.OPTIONS.LEFT}
      icon={<AlignLeftAlt />}
      aria-label={__('Align: left', 'web-stories')}
    />
  );
}

export function Center() {
  return (
    <Alignment
      value={CONFIG.TEXTALIGN.OPTIONS.CENTER}
      icon={<AlignCenterAlt />}
      aria-label={__('Align: center', 'web-stories')}
    />
  );
}

export function Right() {
  return (
    <Alignment
      value={CONFIG.TEXTALIGN.OPTIONS.RIGHT}
      icon={<AlignRightAlt />}
      aria-label={__('Align: right', 'web-stories')}
    />
  );
}

export function Justified() {
  return (
    <Alignment
      property={CONFIG.TEXTALIGN.OPTIONS.JUSTIFIED}
      icon={<AlignMiddleAlt />}
      aria-label={__('Align: justified', 'web-stories')}
    />
  );
}
