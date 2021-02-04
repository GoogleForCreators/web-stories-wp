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
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Union, Lock, Unlock } from '../../../../icons';
import { canMaskHaveBorder } from '../../../../masks';
import { Row, Toggle, Numeric } from '../../../form';
import { useCommonObjectValue } from '../../shared';
import { SimplePanel } from '../../panel';

const TOGGLE_WIDTH = 30;
const ROW_HEIGHT = 32;
const DEFAULT_BORDER_RADIUS = {
  topLeft: 0,
  topRight: 0,
  bottomRight: 0,
  bottomLeft: 0,
  locked: true,
};

const LockToggle = styled(Toggle)`
  position: absolute;
  top: 50%;
  left: ${({ value: locked }) =>
    locked ? 'calc(50% + 5px)' : `calc(100% - ${TOGGLE_WIDTH * 1.5}px)`};
`;

const LockToggleRow = styled(Row)`
  margin: 0;
`;

const BoxedNumeric = styled(Numeric)`
  padding: 6px 6px;
  border-radius: 4px;
`;

const Space = styled.div`
  flex: 0 0 ${({ space }) => (space ? space : TOGGLE_WIDTH)}px;
`;

const BorderRow = styled(Row)`
  margin-bottom: 18px;
`;

const Icon = styled.div`
  flex: 0 0 32px;
  opacity: 0.24;
  text-align: center;
  height: ${ROW_HEIGHT}px;
  margin-bottom: -${ROW_HEIGHT * 2}px;
  svg {
    width: 24px;
  }
`;

function BorderRadiusPanel({ selectedElements, pushUpdateForObject }) {
  const borderRadius = useCommonObjectValue(
    selectedElements,
    'borderRadius',
    DEFAULT_BORDER_RADIUS
  );

  const allSupportBorder = selectedElements.every((el) =>
    canMaskHaveBorder(el)
  );

  const lockRadius = borderRadius.locked === true;

  const handleChange = useCallback(
    (name, value) => {
      const newRadius = !lockRadius
        ? {
            [name]: value,
          }
        : {
            topLeft: value,
            topRight: value,
            bottomRight: value,
            bottomLeft: value,
          };
      pushUpdateForObject(
        'borderRadius',
        newRadius,
        DEFAULT_BORDER_RADIUS,
        true
      );
    },
    [pushUpdateForObject, lockRadius]
  );

  const handleLockChange = useCallback(
    (locked) => {
      const newRadius = locked
        ? {
            locked,
            topLeft: borderRadius.topLeft,
            topRight: borderRadius.topLeft,
            bottomRight: borderRadius.topLeft,
            bottomLeft: borderRadius.topLeft,
          }
        : {
            locked,
          };
      pushUpdateForObject(
        'borderRadius',
        newRadius,
        DEFAULT_BORDER_RADIUS,
        true
      );
    },
    [pushUpdateForObject, borderRadius]
  );

  if (!allSupportBorder) {
    return null;
  }

  const firstInputLabel = lockRadius
    ? __('Corner radius', 'web-stories')
    : __('Top left corner radius', 'web-stories');
  return (
    <SimplePanel name="borderRadius" title={__('Corner radius', 'web-stories')}>
      <BorderRow>
        <BoxedNumeric
          value={borderRadius.topLeft}
          aria-label={firstInputLabel}
          onChange={(value) => handleChange('topLeft', value)}
        />
        {!lockRadius && (
          <>
            <Icon>
              <Union />
            </Icon>
            <BoxedNumeric
              value={borderRadius.topRight}
              aria-label={__('Top right corner radius', 'web-stories')}
              onChange={(value) => handleChange('topRight', value)}
            />
            <Space />
          </>
        )}
      </BorderRow>
      {!lockRadius && (
        <BorderRow>
          <BoxedNumeric
            value={borderRadius.bottomLeft}
            aria-label={__('Bottom left corner radius', 'web-stories')}
            onChange={(value) => handleChange('bottomLeft', value)}
          />
          <Space space={32} />
          <BoxedNumeric
            value={borderRadius.bottomRight}
            aria-label={__('Bottom right corner radius', 'web-stories')}
            onChange={(value) => handleChange('bottomRight', value)}
          />
          <Space />
        </BorderRow>
      )}
      <LockToggleRow>
        <LockToggle
          icon={<Lock />}
          uncheckedIcon={<Unlock />}
          value={borderRadius.locked}
          onChange={() => handleLockChange(!borderRadius.locked)}
          aria-label={__('Toggle corner radius lock', 'web-stories')}
        />
      </LockToggleRow>
    </SimplePanel>
  );
}

BorderRadiusPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdateForObject: PropTypes.func.isRequired,
};

export default BorderRadiusPanel;
