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
import { Row, Toggle, Numeric } from '../../form';
import { SimplePanel } from '../panel';
import { useCommonObjectValue } from '../utils';
import { Lock, Unlock } from '../../../icons';
import { MaskTypes } from '../../../masks';

const DEFAULT_BORDER_RADIUS = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  locked: true,
};

const BoxedNumeric = styled(Numeric)`
  padding: 6px 6px;
  border-radius: 4px;
`;

function BorderRadiusPanel({ selectedElements, pushUpdateForObject }) {
  const borderRadius = useCommonObjectValue(
    selectedElements,
    'borderRadius',
    DEFAULT_BORDER_RADIUS
  );

  const foundNonRectangles = selectedElements.some(
    ({ mask }) => mask?.type && mask?.type !== MaskTypes.RECTANGLE
  );

  const handleChange = useCallback(
    (newRadius, submit = false) => {
      pushUpdateForObject(
        'borderRadius',
        newRadius,
        DEFAULT_BORDER_RADIUS,
        submit
      );
    },
    [pushUpdateForObject]
  );

  if (foundNonRectangles) {
    return null;
  }

  return (
    <SimplePanel name="borderRadius" title={__('Corner radius', 'web-stories')}>
      <Row>
        <BoxedNumeric
          value={borderRadius.left}
          aria-label={__('Edit: Left corner radius', 'web-stories')}
          onChange={(value) =>
            handleChange({
              left: value,
            })
          }
        />
        <Toggle
          icon={<Lock />}
          uncheckedIcon={<Unlock />}
          value={borderRadius.locked}
          /* @todo Confirm locked behavior */
          onChange={() =>
            handleChange({
              locked: !borderRadius.locked,
            })
          }
          aria-label={__('Toggle corner radius lock', 'web-stories')}
        />
        <BoxedNumeric
          value={borderRadius.top}
          aria-label={__('Edit: Top corner radius', 'web-stories')}
          onChange={(value) =>
            handleChange({
              top: value,
            })
          }
        />
        <BoxedNumeric
          value={borderRadius.right}
          aria-label={__('Edit: Right corner radius', 'web-stories')}
          onChange={(value) =>
            handleChange({
              right: value,
            })
          }
        />
        <BoxedNumeric
          value={borderRadius.bottom}
          aria-label={__('Edit: Bottom corner radius', 'web-stories')}
          onChange={(value) =>
            handleChange({
              bottom: value,
            })
          }
        />
      </Row>
    </SimplePanel>
  );
}

BorderRadiusPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdateForObject: PropTypes.func.isRequired,
};

export default BorderRadiusPanel;
