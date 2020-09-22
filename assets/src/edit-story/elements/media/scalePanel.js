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
import { useRef } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import InOverlay from '../../components/overlay';
import RangeInput from '../../components/rangeInput';
import { useKeyDownEffect } from '../../components/keyboard';
import { Z_INDEX_CANVAS } from '../../constants';

const MIN_WIDTH = 165;
const HEIGHT = 28;
const OFFSET_Y = 8;
// @todo: Should maxScale depend on the maximum resolution? Or should that
// be left up to the helper errors? Both? In either case there'd be maximum
// bounding scale.
const MAX_SCALE = 400;

const Container = styled.div`
  position: absolute;
  left: ${({ x, width }) =>
    `${x + (width - Math.max(width, MIN_WIDTH)) / 2}px`};
  top: ${({ y, height }) => `${y + height + OFFSET_Y}px`};
  width: ${({ width }) => `${Math.max(width, MIN_WIDTH)}px`};
  height: ${HEIGHT}px;

  background: ${({ theme }) => theme.colors.t.bg};
  border-radius: 100px;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  padding: 0 4px;
`;

const Reset = styled.button`
  flex: 0 0;
  margin-left: 4px;
  height: 20px;
  text-transform: uppercase;
  font-size: 9px;
  color: ${({ theme }) => theme.colors.fg.white};
  background: ${({ theme }) => theme.colors.accent.primary};
  border-radius: 100px;
  border: none;
  padding: 1px 8px 0 8px;
`;

function ResetButton({ onClick, children }) {
  // We unfortunately have to manually assign this listener, as it would be default behaviour
  // if it wasn't for our listener further up the stack interpreting enter as "enter edit mode"
  // for text and media elements. For shape element selection, this does nothing, that default beviour
  // wouldn't do.
  const ref = useRef();
  useKeyDownEffect(ref, 'enter', onClick, [onClick]);

  return (
    <Reset ref={ref} onClick={onClick}>
      {children}
    </Reset>
  );
}

ResetButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

function ScalePanel({ setProperties, width, height, x, y, scale }) {
  return (
    <InOverlay zIndex={Z_INDEX_CANVAS.FLOAT_PANEL} pointerEvents="initial">
      <Container x={x} y={y} width={width} height={height}>
        <RangeInput
          min={100}
          max={MAX_SCALE}
          majorStep={10}
          minorStep={1}
          value={scale}
          handleChange={(value) => setProperties({ scale: value })}
        />
        <ResetButton onClick={() => setProperties({ scale: 100 })}>
          {__('Reset', 'web-stories')}
        </ResetButton>
      </Container>
    </InOverlay>
  );
}

ScalePanel.propTypes = {
  setProperties: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
};

export default ScalePanel;
