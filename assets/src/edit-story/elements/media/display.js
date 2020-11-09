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
import { useRef } from 'react';
import StoryPropTypes from '../../types';
import { elementFillContent, elementWithBorderRadius } from '../shared';
import { useTransformHandler } from '../../components/transform';
import {
  getBorderStyle,
  isOutsideBorder,
} from '../../components/elementBorder/utils';
import { BORDER_POSITION } from '../../constants';
import { getMediaWithScaleCss } from './util';
import getMediaSizePositionProps from './getMediaSizePositionProps';

const Element = styled.div`
  ${elementFillContent}
  ${elementWithBorderRadius}
  ${({ showPlaceholder }) => showPlaceholder && `background-color: #C4C4C4;`}
  color: transparent;
  overflow: hidden;
  ${({ color, left, top, right, bottom, position, borderRadius }) =>
    position === BORDER_POSITION.OUTSIDE &&
    getBorderStyle({
      color,
      left,
      top,
      right,
      bottom,
      position,
      borderRadius,
    })}
`;

function MediaDisplay({
  element: { id, resource, scale, focalX, focalY, border, borderRadius },
  mediaRef,
  children,
  showPlaceholder = false,
}) {
  const ref = useRef();
  useTransformHandler(id, (transform) => {
    const target = mediaRef.current;
    if (mediaRef.current) {
      if (transform === null) {
        target.style.cssText = '';
      } else {
        const { resize } = transform;
        if (resize && resize[0] !== 0 && resize[1] !== 0) {
          // @todo this needs to resize the outside border element separately now.
          const newImgProps = getMediaSizePositionProps(
            resource,
            resize[0],
            resize[1],
            scale,
            focalX,
            focalY
          );
          target.style.cssText = getMediaWithScaleCss(newImgProps);
          if (isOutsideBorder(border)) {
            // We're undoing the scale for the outside border to ensure it stays correct size.
            // Then add border widths to the new size.
            const mediaScale = Math.max(scale || 100, 100) * 0.01;
            ref.current.style.width =
              newImgProps.width / mediaScale +
              border.left +
              border.right +
              'px';
            ref.current.style.height =
              newImgProps.height / mediaScale +
              border.top +
              border.bottom +
              'px';
          }
        }
      }
    }
  });

  return (
    <Element
      ref={ref}
      borderRadius={borderRadius}
      showPlaceholder={showPlaceholder}
      {...(isOutsideBorder(border) ? border : null)}
    >
      {children}
    </Element>
  );
}

MediaDisplay.propTypes = {
  element: StoryPropTypes.elements.media,
  mediaRef: PropTypes.object,
  children: PropTypes.node.isRequired,
  showPlaceholder: PropTypes.bool,
};

export default MediaDisplay;
