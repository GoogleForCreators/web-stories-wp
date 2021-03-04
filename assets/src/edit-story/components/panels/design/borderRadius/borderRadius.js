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
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { Union } from '../../../../icons';
import { canMaskHaveBorder } from '../../../../masks';
import { Row } from '../../../form';
import { useCommonObjectValue } from '../../shared';
import { SimplePanel } from '../../panel';
import { LockToggle, NumericInput } from '../../../../../design-system';

const TOGGLE_WIDTH = 32;
const ROW_HEIGHT = 32;
const DEFAULT_BORDER_RADIUS = {
  topLeft: 0,
  topRight: 0,
  bottomRight: 0,
  bottomLeft: 0,
  locked: true,
};

const FlexContainer = styled.div`
  display: flex;
`;

const InputContainer = styled.div``;

const LockContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 8px;
  margin-bottom: 16px;
`;

const BoxedNumericInput = styled(NumericInput)`
  width: 100px;
  max-width: 128px;
`;

const Space = styled.div`
  flex: 0 0 ${({ space }) => (space ? space : TOGGLE_WIDTH)}px;
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
      <FlexContainer>
        <InputContainer>
          <Row>
            <BoxedNumericInput
              value={borderRadius.topLeft}
              aria-label={firstInputLabel}
              onChange={(_, value) => handleChange('topLeft', value)}
            />
            {!lockRadius && (
              <>
                <Icon>
                  <Union />
                </Icon>
                <BoxedNumericInput
                  value={borderRadius.topRight}
                  aria-label={__('Top right corner radius', 'web-stories')}
                  onChange={(_, value) => handleChange('topRight', value)}
                />
              </>
            )}
          </Row>
          {!lockRadius && (
            <Row>
              <BoxedNumericInput
                value={borderRadius.bottomLeft}
                aria-label={__('Bottom left corner radius', 'web-stories')}
                onChange={(_, value) => handleChange('bottomLeft', value)}
              />
              <Space space={32} />
              <BoxedNumericInput
                value={borderRadius.bottomRight}
                aria-label={__('Bottom right corner radius', 'web-stories')}
                onChange={(_, value) => handleChange('bottomRight', value)}
              />
            </Row>
          )}
        </InputContainer>

        <LockContainer>
          <LockToggle
            isLocked={borderRadius.locked}
            onClick={() => handleLockChange(!borderRadius.locked)}
            aria-label={__('Toggle corner radius lock', 'web-stories')}
          />
        </LockContainer>
      </FlexContainer>
    </SimplePanel>
  );
}

BorderRadiusPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdateForObject: PropTypes.func.isRequired,
};

export default BorderRadiusPanel;
