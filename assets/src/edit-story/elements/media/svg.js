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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import { elementFillContent, elementWithBorder } from '../shared';
import { getResponsiveBorder } from '../../utils/elementBorder';

const Element = styled.div.attrs({ className: 'story-media-display-element' })`
  ${elementFillContent}
  ${({ showPlaceholder }) => showPlaceholder && `background-color: #C4C4C4;`}
  color: transparent;
  overflow: hidden;
  ${elementWithBorder}
`;

function MediaSVG({ element, children, previewMode, showPlaceholder = false }) {
  const { border, borderRadius, width, height } = element;

  const { left = 0, top = 0, right = 0, bottom = 0 } = element.border || {};

  const foProps = {
    width: element.width + left + right,
    height: element.height + top + bottom,
  };

  return (
    <foreignObject {...foProps}>
      <Element
        border={getResponsiveBorder(border, previewMode)}
        borderRadius={borderRadius}
        width={width}
        height={height}
        showPlaceholder={showPlaceholder}
      >
        {children}
      </Element>
    </foreignObject>
  );
}

MediaSVG.propTypes = {
  element: StoryPropTypes.elements.media,
  children: PropTypes.node.isRequired,
  showPlaceholder: PropTypes.bool,
  previewMode: PropTypes.bool,
};

export default MediaSVG;
