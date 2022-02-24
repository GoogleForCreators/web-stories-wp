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
import { __ } from '@googleforcreators/i18n';
import { ColorStopPropType } from '@googleforcreators/patterns';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import Tooltip from '../tooltip';
import GradientLine from './gradientLine';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px 0;
  height: 60px;
`;

const Buttons = styled.div`
  display: flex;
  gap: 8px;
`;

const SmallButton = styled(Button)`
  width: 24px;
  height: 24px;
  padding: 0;
  svg {
    width: 24px;
    height: 24px;
  }
`;

function GradientPicker({
  stops,
  currentStopIndex,
  type,

  onSelect,
  onAdd,
  onDelete,
  onMove,

  onRotate,
  onReverse,
}) {
  const reverseLabel = __('Reverse gradient stops', 'web-stories');
  const rotateLabel = __('Rotate gradient', 'web-stories');
  const canRotate = type !== 'radial';
  return (
    <Wrapper>
      <GradientLine
        stops={stops}
        currentStopIndex={currentStopIndex}
        onSelect={onSelect}
        onAdd={onAdd}
        onDelete={onDelete}
        onMove={onMove}
      />
      <Buttons>
        <Tooltip hasTail title={reverseLabel}>
          <SmallButton
            aria-label={reverseLabel}
            onClick={onReverse}
            type={BUTTON_TYPES.QUATERNARY}
            size={BUTTON_SIZES.SMALL}
            variant={BUTTON_VARIANTS.SQUARE}
          >
            <Icons.ArrowsLeftright />
          </SmallButton>
        </Tooltip>
        {canRotate && (
          <Tooltip hasTail title={rotateLabel}>
            <SmallButton
              onClick={onRotate}
              aria-label={rotateLabel}
              type={BUTTON_TYPES.QUATERNARY}
              size={BUTTON_SIZES.SMALL}
              variant={BUTTON_VARIANTS.SQUARE}
            >
              <Icons.ArrowRightCurved id="gradient-rotator" />
            </SmallButton>
          </Tooltip>
        )}
      </Buttons>
    </Wrapper>
  );
}

GradientPicker.propTypes = {
  stops: PropTypes.arrayOf(ColorStopPropType),
  currentStopIndex: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,

  onSelect: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,

  onReverse: PropTypes.func.isRequired,
  onRotate: PropTypes.func.isRequired,
};

export default GradientPicker;
