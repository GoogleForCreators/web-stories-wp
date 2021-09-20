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

/**
 * Internal dependencies
 */
import { getMaskByType } from '../../masks';
import { elementWithBackgroundColor } from '../shared';
import StoryPropTypes from '../../types';

const PREVIEW_SIZE = 16;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 28px;
  width: 28px;
  border-radius: ${({ theme }) => theme.borders.radius.small};
  background-color: ${({ theme }) => theme.colors.opacity.black10};
`;

const ShapePreview = styled.div`
  ${elementWithBackgroundColor}
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`;

function ShapeLayerIcon({
  element: { id, mask, backgroundColor, isDefaultBackground },
  currentPage,
}) {
  const maskDef = getMaskByType(mask.type);

  const maskId = `mask-${maskDef.type}-${id}-layer-preview`;
  if (isDefaultBackground) {
    backgroundColor = currentPage.backgroundColor;
  }
  return (
    <Container>
      <ShapePreview
        style={{
          clipPath: `url(#${maskId})`,
        }}
        width={PREVIEW_SIZE * maskDef.ratio}
        height={PREVIEW_SIZE}
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
    </Container>
  );
}

ShapeLayerIcon.propTypes = {
  element: StoryPropTypes.element.isRequired,
  currentPage: StoryPropTypes.page,
};

export default ShapeLayerIcon;
