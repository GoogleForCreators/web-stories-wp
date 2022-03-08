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
import { getMaskByType } from '@googleforcreators/masks';
import PropTypes from 'prop-types';
import { StoryPropTypes } from '@googleforcreators/elements';
import { generatePatternStyles } from '@googleforcreators/patterns';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 21px;
  width: 21px;
  padding: 1px;
  border-radius: ${({ theme }) => theme.borders.radius.small};
  background-color: ${({ theme }) => theme.colors.opacity.black10};
`;

const ShapePreview = styled.div.attrs(({ backgroundColor }) => ({
  // Prevents `ShapePreview` class from being generated with each new layer.
  // https://styled-components.com/docs/faqs#when-to-use-attrs
  style: generatePatternStyles(backgroundColor),
}))`
  width: 100%;
  height: 100%;
  margin: 1px;
  clip-path: ${({ maskId }) => `url(#${maskId})`};
`;

/*
clip-path isn't stable in Safari yet, so these
Shape Layer Icons are going to show up as various quadrilateral
until that stabilizes for inline SVGs as clip paths.
More info here:
https://stackoverflow.com/questions/41860477/why-doesnt-css-clip-path-with-svg-work-in-safari
https://caniuse.com/css-clip-path
*/

function ShapeLayerIcon({
  element: { id, mask, backgroundColor, isDefaultBackground },
  currentPageBackgroundColor,
}) {
  const maskDef = getMaskByType(mask.type);

  const maskId = `mask-${maskDef.type}-${id}-layer-preview`;
  if (isDefaultBackground) {
    backgroundColor = currentPageBackgroundColor;
  }

  return (
    <Container>
      <ShapePreview maskId={maskId} backgroundColor={backgroundColor}>
        <svg width={0} height={0}>
          <defs>
            <clipPath
              id={maskId}
              // Bring the path scale down a bit from 1
              // so that we can make sure the entire SVG path is visible when the mask ratio is > 1
              // this is important for Firefox's interpretation of clip paths
              transform="scale(1 0.9)"
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
  currentPageBackgroundColor: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
};

export default ShapeLayerIcon;
