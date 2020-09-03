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
import { useMemo } from 'react';

/**
 * Internal dependencies
 */
import { getMaskByType } from '../../masks';
import { elementWithBackgroundColor } from '../shared';
import StoryPropTypes from '../../types';
import getBrightnessFromPattern from '../../utils/getBrightnessFromPattern';

const TOO_BRIGHT = 0.5;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ShapePreview = styled.div`
  ${elementWithBackgroundColor}
  width: ${({ width = 20 }) => width}px;
  height: ${({ height = 20 }) => height}px;
  margin-right: 8px;
`;

const ShapePreviewContainer = styled.div`
  ${({ isTooBright }) =>
    isTooBright &&
    `
      /* Using filter rather than box-shadow to correctly follow
      * outlines of shapes.
      */
      filter: drop-shadow( 0 0 5px rgba(0, 0, 0, 0.5) );
    `}
`;

function ShapeLayerContent({ element: { id, mask, backgroundColor } }) {
  const maskDef = getMaskByType(mask.type);

  const isTooBright = useMemo(() => {
    return getBrightnessFromPattern(backgroundColor) >= TOO_BRIGHT;
  }, [backgroundColor]);

  const maskId = `mask-${maskDef.type}-${id}-layer-preview`;

  return (
    <Container>
      <ShapePreviewContainer isTooBright={isTooBright}>
        <ShapePreview
          style={{
            clipPath: `url(#${maskId})`,
          }}
          width={20 * maskDef.ratio}
          backgroundColor={backgroundColor}
        >
          <svg width={0} height={0}>
            <defs>
              <clipPath
                id={maskId}
                transform={`scale(1 ${maskDef.ratio})`}
                clipPathUnits="objectBoundingBox"
              >
                <path d={maskDef.path} />
              </clipPath>
            </defs>
          </svg>
        </ShapePreview>
      </ShapePreviewContainer>

      {maskDef.name}
    </Container>
  );
}

ShapeLayerContent.propTypes = {
  element: StoryPropTypes.element.isRequired,
};

export default ShapeLayerContent;
