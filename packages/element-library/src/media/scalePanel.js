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
import { _x } from '@googleforcreators/i18n';
import { Slider } from '@googleforcreators/design-system';
import { BG_MIN_SCALE, BG_MAX_SCALE } from '@googleforcreators/animation';
import { InOverlay } from '@googleforcreators/moveable';

const MIN_WIDTH = 165;
const HEIGHT = 36;
const OFFSET_Y = 8;
const HORIZONTAL_PADDING = 8;

const Container = styled.div`
  position: absolute;
  left: ${({ x, width }) =>
    `${x + (width - Math.max(width, MIN_WIDTH)) / 2}px`};
  top: ${({ y, height }) => `${y + height + OFFSET_Y}px`};
  width: ${({ width }) => `${Math.max(width, MIN_WIDTH)}px`};
  height: ${HEIGHT}px;
  background: ${({ theme }) => theme.colors.bg.primary};
  border-radius: 8px;
  padding: 3px ${HORIZONTAL_PADDING}px;
  margin-top: 8px;
`;

const ScaleSlider = styled(Slider)`
  width: ${({ width }) =>
    Math.max(width, MIN_WIDTH) - 2 * HORIZONTAL_PADDING}px;
`;

function ScalePanel({
  setProperties,
  width,
  height,
  x,
  y,
  scale,
  zIndexCanvas,
  ...rest
}) {
  return (
    <InOverlay zIndex={zIndexCanvas.FLOAT_PANEL} pointerEvents="initial">
      <Container x={x} y={y} width={width} height={height}>
        {/*
          @todo: Should maxScale depend on the maximum resolution? Or should that
          be left up to the helper errors? Both? In either case there'd be maximum
          bounding scale.
        */}
        <ScaleSlider
          width={width}
          min={BG_MIN_SCALE}
          max={BG_MAX_SCALE}
          majorStep={10}
          minorStep={1}
          value={scale}
          handleChange={(value) => setProperties({ scale: value })}
          thumbSize={24}
          suffix={_x('%', 'Percentage', 'web-stories')}
          {...rest}
        />
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
  zIndexCanvas: PropTypes.object,
};

export default ScalePanel;
