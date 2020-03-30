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
import { elementWithFillColor } from '../shared';
import StoryPropTypes from '../../types';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const ShapePreview = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  margin-right: 8px;
`;

const Path = styled.path`
  ${elementWithFillColor}
`;

function ShapeLayerContent({ element: { mask, backgroundColor } }) {
  const maskDef = getMaskByType(mask.type);
  return (
    <Container>
      <ShapePreview alt={maskDef.name} backgroundColor={backgroundColor}>
        <svg
          viewBox={`0 0 1 ${1 / maskDef.ratio}`}
          width={20 * maskDef.ratio}
          height={20}
        >
          <Path d={maskDef.path} fill={backgroundColor} />
        </svg>
      </ShapePreview>
      {maskDef.name}
    </Container>
  );
}

ShapeLayerContent.propTypes = {
  element: StoryPropTypes.element.isRequired,
};

export default ShapeLayerContent;
