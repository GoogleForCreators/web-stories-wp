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
import styled from 'styled-components';
import { _x } from '@googleforcreators/i18n';
import { Slider } from '@googleforcreators/design-system';
import { InOverlay } from '@googleforcreators/moveable';
import type { MediaElement } from '@googleforcreators/elements';

const MIN_WIDTH = 165;
const HEIGHT = 36;
const OFFSET_Y = 8;
const HORIZONTAL_PADDING = 8;

const Container = styled.div<{
  $x: number;
  $y: number;
  $width: number;
  $height: number;
}>`
  position: absolute;
  left: ${({ $x, $width }) =>
    `${$x + ($width - Math.max($width, MIN_WIDTH)) / 2}px`};
  top: ${({ $y, $height }) => `${$y + $height + OFFSET_Y}px`};
  width: ${({ $width }) => `${Math.max($width, MIN_WIDTH)}px`};
  height: ${HEIGHT}px;
  background: ${({ theme }) => theme.colors.bg.primary};
  border-radius: 8px;
  padding: 3px ${HORIZONTAL_PADDING}px;
  margin-top: 8px;
`;

const ScaleSlider = styled(Slider)<{ width: number }>`
  width: ${({ width }) =>
    Math.max(width, MIN_WIDTH) - 2 * HORIZONTAL_PADDING}px;
`;

interface ScalePanelProps<T> {
  setProperties: (properties: Partial<T>) => void;
  width: number;
  height: number;
  x: number;
  y: number;
  scale: number;
  zIndexCanvas: Record<string, number>;
  min?: number;
  max?: number;
}

function ScalePanel<T extends MediaElement = MediaElement>({
  setProperties,
  width,
  height,
  x,
  y,
  scale,
  zIndexCanvas,
  ...rest
}: ScalePanelProps<T>) {
  return (
    <InOverlay zIndex={zIndexCanvas.FLOAT_PANEL} pointerEvents="initial">
      <Container $x={x} $y={y} $width={width} $height={height}>
        {/*
          @todo: Should maxScale depend on the maximum resolution? Or should that
          be left up to the helper errors? Both? In either case there'd be maximum
          bounding scale.
        */}
        <ScaleSlider
          width={width}
          majorStep={10}
          minorStep={1}
          value={scale}
          handleChange={(value: number) =>
            setProperties({ scale: value } as Partial<T>)
          }
          thumbSize={24}
          suffix={_x('%', 'Percentage', 'web-stories')}
          {...rest}
        />
      </Container>
    </InOverlay>
  );
}

export default ScalePanel;
