/*
 * Copyright 2021 Google LLC
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
import { Icons, NumericInput } from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { canSupportMultiBorder } from '../../../masks';
import { DEFAULT_BORDER_RADIUS } from '../../panels/design/sizePosition/radius';
import { Separator, useProperties } from './shared';

const StyledInput = styled(NumericInput)`
  width: 70px;
  flex: 0 0 70px;
`;

function BorderRadius() {
  // Note that "mask" never updates on an element,
  // so selecting it cannot cause re-renders
  // We need it to determine if radii are supported.
  const { borderRadius = DEFAULT_BORDER_RADIUS, mask } = useProperties([
    'borderRadius',
    'mask',
  ]);
  const updateSelectedElements = useStory(
    (state) => state.actions.updateSelectedElements
  );

  // Only multi-border elements support border radius
  const canHaveBorderRadius = canSupportMultiBorder({ mask });

  // Render nothing if radii not supported or not locked
  if (!canHaveBorderRadius || !borderRadius.locked) {
    return null;
  }

  const handleChange = (value) =>
    updateSelectedElements({
      properties: {
        borderRadius: {
          locked: true,
          topLeft: value,
          topRight: value,
          bottomRight: value,
          bottomLeft: value,
        },
      },
    });

  return (
    <>
      <StyledInput
        suffix={<Icons.Corner />}
        value={borderRadius.topLeft}
        aria-label={__('Corner Radius', 'web-stories')}
        onChange={(_, value) => handleChange(value)}
      />
      <Separator />
    </>
  );
}

export default BorderRadius;
