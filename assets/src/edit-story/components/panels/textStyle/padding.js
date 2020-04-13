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
import styled from 'styled-components';
import { useCallback } from 'react';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Label, Numeric, Row, Toggle, MULTIPLE_VALUE } from '../../form';
import { ReactComponent as Locked } from '../../../icons/lock.svg';
import { ReactComponent as Unlocked } from '../../../icons/unlock.svg';
import { useCommonObjectValue } from '../utils';

const DEFAULT_PADDING = { horizontal: 0, vertical: 0, locked: true };

const BoxedNumeric = styled(Numeric)`
  padding: 6px 6px;
  border-radius: 4px;
`;

const Space = styled.div`
  flex: 0 0 10px;
`;

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
    (newPadding) => {
      let update = newPadding;
      if (lockPadding) {
        const commonPadding =
          newPadding.horizontal !== undefined
            ? newPadding.horizontal
            : newPadding.vertical;
        update = {
          horizontal: commonPadding,
          vertical: commonPadding,
        };

        if (padding.locked === MULTIPLE_VALUE) update.locked = lockPadding;
      }
      pushUpdateForObject('padding', update, DEFAULT_PADDING);
    },
    [pushUpdateForObject, lockPadding, padding]
  );

  return (
    <Row>
      <Label>{__('Padding', 'web-stories')}</Label>
      <BoxedNumeric
        data-testid="padding.horizontal"
        suffix={_x('H', 'The Horizontal padding', 'web-stories')}
        value={padding.horizontal}
        onChange={(value) => handleChange({ horizontal: value })}
      />
      <Space />
      <Toggle
        data-testid="padding.lock"
        icon={<Locked />}
        uncheckedIcon={<Unlocked />}
        value={lockPadding}
        onChange={() =>
          pushUpdateForObject(
            'padding',
            { locked: !lockPadding },
            DEFAULT_PADDING
          )
        }
      />
      <Space />
      <BoxedNumeric
        data-testid="padding.vertical"
        suffix={_x('V', 'The Vertical padding', 'web-stories')}
        value={padding.vertical}
        onChange={(value) => handleChange({ vertical: value })}
      />
    </Row>
  );
}

PaddingControls.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdateForObject: PropTypes.func.isRequired,
};

export default PaddingControls;
