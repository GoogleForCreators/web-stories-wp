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

/**
 * Internal dependencies
 */
import { ColorStopPropType } from '../../types';
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from '../../../design-system/components/button';
import { Button, Icons } from '../../../design-system';
import GradientLine from './gradientLine';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-right: -3px;
  padding: 0 12px;
  height: 58px;
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
      <Button
        aria-label={__('Reverse gradient stops', 'web-stories')}
        onClick={onReverse}
        type={BUTTON_TYPES.TERTIARY}
        size={BUTTON_SIZES.SMALL}
        variant={BUTTON_VARIANTS.CIRCLE}
      >
        <Icons.ArrowsLeftright />
      </Button>
      <Button
        onClick={onRotate}
        aria-label={__('Rotate gradient', 'web-stories')}
        type={BUTTON_TYPES.TERTIARY}
        size={BUTTON_SIZES.SMALL}
        variant={BUTTON_VARIANTS.CIRCLE}
      >
        <Icons.ArrowRightCurved id="gradient-rotator" />
      </Button>
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
