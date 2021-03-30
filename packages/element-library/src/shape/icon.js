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
import { getMaskByType } from '@web-stories-wp/masks';
import {
  elementWithBackgroundColor,
  StoryElementPropType,
} from '@web-stories-wp/elements';

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
  width: ${({ width = 16 }) => width}px;
  height: auto;
`;

function ShapeLayerIcon({ element: { id, mask, backgroundColor } }) {
  const maskDef = getMaskByType(mask.type);

  const maskId = `mask-${maskDef.type}-${id}-layer-preview`;

  return (
    <Container>
      <ShapePreview
        style={{
          clipPath: `url(#${maskId})`,
        }}
        width={16 * maskDef.ratio}
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
  element: StoryElementPropType.isRequired,
};

export default ShapeLayerIcon;
