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
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { __, sprintf } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import generatePatternStyles from '../../utils/generatePatternStyles';
import { LINE_LENGTH, LINE_WIDTH } from './constants';

const POINTER_SIZE = 14;
const POINTER_MARGIN = 10;
const Stop = styled.button.attrs(({ position }) => ({
  style: {
    left: `${position * LINE_LENGTH + LINE_WIDTH / 2}px`,
  },
}))`
  position: absolute;
  top: -${POINTER_MARGIN + POINTER_SIZE}px;
  background: transparent;
  border: 0;
  padding: 0;

  &:focus {
    /* We auto-select stops on focus, so no extra focus display is necessary */
    outline: none;
  }
`;

const StopPointer = styled.div`
  transform: translate(${({ offset }) => `${offset}px`}, 0);
  width: ${POINTER_SIZE}px;
  height: ${POINTER_SIZE}px;
  border-radius: 2px;
  ${({ color }) => generatePatternStyles(color)}
`;

function GradientStopWithRef(
  { position, index, isSelected, color, onSelect },
  ref
) {
  return (
    <Stop
      ref={ref}
      key={index}
      isSelected={isSelected}
      position={position}
      onFocus={() => onSelect(index)}
      onClick={() => onSelect(index)}
      aria-selected={isSelected}
      aria-label={sprintf(
        /* translators: %d: stop percentage */
        __('Gradient stop at %1$d%%', 'web-stories'),
        Math.round(position * 100)
      )}
    >
      <StopPointer color={color} offset={-8} />
    </Stop>
  );
}

const GradientStop = forwardRef(GradientStopWithRef);

GradientStop.propTypes = {
  position: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  isSelected: PropTypes.bool.isRequired,
  color: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};

GradientStopWithRef.propTypes = GradientStop.propTypes;

export default GradientStop;
