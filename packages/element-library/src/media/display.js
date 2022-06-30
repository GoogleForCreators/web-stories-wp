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
import { useRef } from '@googleforcreators/react';
import { useUnits } from '@googleforcreators/units';
import { getMediaSizePositionProps } from '@googleforcreators/media';
import { useTransformHandler } from '@googleforcreators/transform';
import {
  getResponsiveBorder,
  shouldDisplayBorder,
} from '@googleforcreators/masks';
import { StoryPropTypes } from '@googleforcreators/elements';
import { Blurhash } from 'react-blurhash';

/**
 * Internal dependencies
 */
import {
  elementFillContent,
  elementWithBorder,
  elementWithBackgroundColor,
  useColorTransformHandler,
} from '../shared';
import { getMediaWithScaleCss } from './util';

const Element = styled.div.attrs({ className: 'story-media-display-element' })`
  ${elementFillContent}
  ${({ showPlaceholder, $placeholderColor }) =>
    showPlaceholder && `background-color: ${$placeholderColor};`}
  color: transparent;
  overflow: hidden;
  ${elementWithBorder}
`;

const BlurhashContainer = styled(Blurhash)`
  position: absolute !important;
  top: 0;
  left: 0;
  min-height: 100%;
  min-width: 100%;
`;

const Overlay = styled.div`
  ${elementFillContent}
  ${elementWithBackgroundColor}
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
    overlay,
    mask,
  } = element;

  const { baseColor, blurHash } = resource;

  const placeholderColor = baseColor || '#C4C4C4';

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
      mask={mask}
      showPlaceholder={showPlaceholder}
      $placeholderColor={placeholderColor}
    >
      {showPlaceholder && blurHash && (
        <BlurhashContainer
          hash={blurHash}
          width={width}
          height={height}
          punch={1}
        />
      )}
      {children}
      {overlay && <Overlay backgroundColor={overlay} />}
    </Element>
  );
}

MediaDisplay.propTypes = {
  element: StoryPropTypes.elements.media.isRequired,
  mediaRef: PropTypes.object,
  children: PropTypes.node,
  showPlaceholder: PropTypes.bool,
  previewMode: PropTypes.bool,
};

export default MediaDisplay;
