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

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Label, Numeric, Row, Toggle } from '../../form';
import { dataPixels } from '../../../units';
import { ReactComponent as Locked } from '../../../icons/lock.svg';
import { ReactComponent as Unlocked } from '../../../icons/unlock.svg';

const BoxedNumeric = styled(Numeric)`
  padding: 6px 6px;
  border-radius: 4px;
`;

const Space = styled.div`
  flex: 0 0 10px;
`;

function PaddingControls({
  properties,
  state,
  setState,
  setLockPaddingRatio,
  lockPaddingRatio,
  getPaddingRatio,
}) {
  const { padding } = properties;
  return (
    <Row>
      <Label>{__('Padding', 'web-stories')}</Label>
      <BoxedNumeric
        suffix={_x('H', 'The Horizontal padding', 'web-stories')}
        value={state.padding.horizontal}
        onChange={(value) => {
          const ratio = getPaddingRatio(padding.horizontal, padding.vertical);
          const newPadding = {
            horizontal:
              isNaN(value) || '' === value ? '' : dataPixels(parseInt(value)),
          };
          newPadding.vertical =
            typeof padding.horizontal === 'number' && lockPaddingRatio && ratio
              ? Math.round(dataPixels(parseInt(newPadding.horizontal)) / ratio)
              : padding.vertical;
          setState({ ...state, padding: newPadding });
        }}
      />
      <Space />
      <Toggle
        icon={<Locked />}
        uncheckedIcon={<Unlocked />}
        isMultiple={false}
        value={lockPaddingRatio}
        onChange={setLockPaddingRatio}
      />
      <Space />
      <BoxedNumeric
        suffix={_x('V', 'The Vertical padding', 'web-stories')}
        value={state.padding.vertical}
        onChange={(value) => {
          const ratio = getPaddingRatio(padding.horizontal, padding.vertical);
          const newPadding = {
            vertical:
              isNaN(value) || '' === value ? '' : dataPixels(parseInt(value)),
          };
          newPadding.horizontal =
            padding.horizontal !== '' &&
            typeof padding.vertical === 'number' &&
            lockPaddingRatio &&
            ratio
              ? Math.round(dataPixels(parseInt(newPadding.vertical)) / ratio)
              : padding.horizontal;
          setState({ ...state, padding: newPadding });
        }}
      />
    </Row>
  );
}

PaddingControls.propTypes = {
  properties: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
  setLockPaddingRatio: PropTypes.func.isRequired,
  lockPaddingRatio: PropTypes.bool.isRequired,
  getPaddingRatio: PropTypes.func.isRequired,
};

export default PaddingControls;
