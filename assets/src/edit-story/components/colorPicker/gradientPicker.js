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
import { __ } from '@web-stories-wp/i18n';
import { ColorStopPropType } from '@web-stories-wp/patterns';

/**
 * Internal dependencies
 */
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
} from '../../../design-system';
import Tooltip from '../tooltip';
import GradientLine from './gradientLine';

const Wrapper = styled.div`
  display: flex;
  align-items: flex-end;
  padding: 16px 14px;
  height: 74px;
  border-top: 1px solid ${({ theme }) => theme.colors.divider.primary};
`;

const SmallButton = styled(Button)`
  width: 24px;
  height: 24px;
  padding: 0;
  margin-bottom: -3px;
  svg {
    width: 24px;
    height: 24px;
  }
`;

const Space = styled.div`
  width: 6px;
`;

function GradientPicker({
  stops,
  currentStopIndex,

  onSelect,
  onAdd,
  onDelete,
  onMove,

  onRotate,
  onReverse,
}) {
  const reverseLabel = __('Reverse gradient stops', 'web-stories');
  const rotateLabel = __('Rotate gradient', 'web-stories');
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
      <Space />
      <Tooltip hasTail title={reverseLabel}>
        <SmallButton
          aria-label={reverseLabel}
          onClick={onReverse}
          type={BUTTON_TYPES.TERTIARY}
          size={BUTTON_SIZES.SMALL}
          variant={BUTTON_VARIANTS.SQUARE}
        >
          <Icons.ArrowsLeftright />
        </SmallButton>
      </Tooltip>
      <Tooltip hasTail title={rotateLabel}>
        <SmallButton
          onClick={onRotate}
          aria-label={rotateLabel}
          type={BUTTON_TYPES.TERTIARY}
          size={BUTTON_SIZES.SMALL}
          variant={BUTTON_VARIANTS.SQUARE}
        >
          <Icons.ArrowRightCurved id="gradient-rotator" />
        </SmallButton>
      </Tooltip>
    </Wrapper>
  );
}

GradientPicker.propTypes = {
  stops: PropTypes.arrayOf(ColorStopPropType),
  currentStopIndex: PropTypes.number.isRequired,

  onSelect: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,

  onReverse: PropTypes.func.isRequired,
  onRotate: PropTypes.func.isRequired,
};

export default GradientPicker;
