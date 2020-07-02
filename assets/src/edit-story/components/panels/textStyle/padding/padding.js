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
import { useCallback } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import clamp from '../../../../utils/clamp';
import { Label, Row, MULTIPLE_VALUE, usePresubmitHandler } from '../../../form';
import { useCommonObjectValue } from '../../utils';
import LockedPaddingControls from './locked';
import UnlockedPaddingControls from './unlocked';

export const DEFAULT_PADDING = { horizontal: 0, vertical: 0, locked: true };

export const MIN_MAX = {
  HORIZONTAL_PADDING: {
    MIN: 0,
    MAX: 300,
  },
  VERTICAL_PADDING: {
    MIN: 0,
    MAX: 300,
  },
};

function PaddingControls({ selectedElements, pushUpdateForObject }) {
  const padding = useCommonObjectValue(
    selectedElements,
    'padding',
    DEFAULT_PADDING
  );

  // When multiple element selected with padding locked value combined, it treated as false, reversed behavior with aspect lock ratio.
  const lockPadding =
    padding.locked === MULTIPLE_VALUE ? false : padding.locked;

  const handleChange = useCallback(
    (newPadding, submit = false) => {
      pushUpdateForObject('padding', newPadding, DEFAULT_PADDING, submit);
    },
    [pushUpdateForObject]
  );

  usePresubmitHandler(
    ({ padding: { horizontal, vertical, ...rest } }) => ({
      padding: {
        ...rest,
        horizontal: clamp(horizontal, MIN_MAX.HORIZONTAL_PADDING),
        vertical: clamp(vertical, MIN_MAX.VERTICAL_PADDING),
      },
    }),
    []
  );

  return (
    <Row>
      <Label>{__('Padding', 'web-stories')}</Label>
      {lockPadding ? (
        <LockedPaddingControls padding={padding} handleChange={handleChange} />
      ) : (
        <UnlockedPaddingControls
          padding={padding}
          handleChange={handleChange}
        />
      )}
    </Row>
  );
}

PaddingControls.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdateForObject: PropTypes.func.isRequired,
};

export default PaddingControls;
