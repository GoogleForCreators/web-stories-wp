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
import { elementFillContent, elementWithBorder } from '../shared';
import { useTransformHandler } from '../../components/transform';
import {
  getResponsiveBorder,
  shouldDisplayBorder,
} from '../../utils/elementBorder';
import useColorTransformHandler from '../shared/useColorTransformHandler';
import { useUnits } from '../../units';
import { getMediaWithScaleCss } from './util';
import getMediaSizePositionProps from './getMediaSizePositionProps';

const Element = styled.div.attrs({ className: 'story-media-display-element' })`
  ${elementFillContent}
  ${({ showPlaceholder }) => showPlaceholder && `background-color: #C4C4C4;`}
  color: transparent;
  overflow: hidden;
  ${elementWithBorder}
`;

function MediaDisplay({
  element,
  mediaRef,
  children,
  previewMode,
  showPlaceholder = false,
}) {
  const {
    id,
    resource,
    scale,
    focalX,
    focalY,
    border,
    borderRadius,
    width,
    height,
  } = element;

  const { dataToEditorX } = useUnits((state) => ({
    dataToEditorX: state.actions.dataToEditorX,
  }));

  const ref = useRef();
  useColorTransformHandler({
    id,
    targetRef: ref,
    expectedStyle: 'border-color',
  });
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
          if (shouldDisplayBorder(element)) {
            ref.current.style.width =
              resize[0] + border.left + border.right + 'px';
            ref.current.style.height =
              resize[1] + border.top + border.bottom + 'px';
          }
        }
      }
    }
  });

  return (
    <Element
      ref={ref}
      border={getResponsiveBorder(border, previewMode, dataToEditorX)}
      borderRadius={borderRadius}
      width={width}
      height={height}
      showPlaceholder={showPlaceholder}
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
  previewMode: PropTypes.bool,
};

export default MediaDisplay;
