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
import { useRef } from '@googleforcreators/react';
import { useUnits } from '@googleforcreators/units';
import { getMediaSizePositionProps } from '@googleforcreators/media';
import { useTransformHandler } from '@googleforcreators/transform';
import {
  getResponsiveBorder,
  shouldDisplayBorder,
} from '@googleforcreators/masks';
import {
  type SequenceMediaElement,
  type OverlayableElement,
  type Element as ElementType,
  type MediaElement,
} from '@googleforcreators/elements';
import type { ReactNode, RefObject } from 'react';

/**
 * Internal dependencies
 */
import {
  elementFillContent,
  elementWithBorder,
  elementWithBackgroundColor,
  useColorTransformHandler,
} from '../shared';
import type { DisplayProps } from '../types';
import { getMediaWithScaleCss } from './util';

const Element = styled.div.attrs({ className: 'story-media-display-element' })<
  {
    showPlaceholder: boolean;
  } & Pick<ElementType, 'border' | 'borderRadius' | 'width' | 'height' | 'mask'>
>`
  ${elementFillContent}
  ${({ showPlaceholder }) => showPlaceholder && `background-color: #C4C4C4;`}
  color: transparent;
  overflow: hidden;
  ${elementWithBorder}
`;

const Overlay = styled.div`
  ${elementFillContent}
  ${elementWithBackgroundColor}
`;

interface MediaDisplayProps<T extends MediaElement> {
  element: T & OverlayableElement;
  showPlaceholder?: boolean;
  previewMode?: boolean;
  mediaRef: RefObject<
    T extends SequenceMediaElement
      ? HTMLVideoElement | HTMLImageElement
      : HTMLImageElement
  >;
  renderResourcePlaceholder?: DisplayProps['renderResourcePlaceholder'];
  children: ReactNode;
}
function MediaDisplay<T extends MediaElement>({
  element,
  mediaRef,
  children,
  previewMode,
  showPlaceholder = false,
  renderResourcePlaceholder,
}: MediaDisplayProps<T>) {
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

  const { dataToEditorX } = useUnits((state) => ({
    dataToEditorX: state.actions.dataToEditorX,
  }));

  const ref = useRef<HTMLDivElement>(null);
  useColorTransformHandler({
    id,
    targetRef: ref,
    expectedStyle: 'border-color',
  });
  useTransformHandler(id, (transform) => {
    const target = mediaRef.current;
    if (target) {
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
          if (shouldDisplayBorder(element) && ref.current) {
            ref.current.style.width =
              resize[0] + (border?.left || 0) + (border?.right || 0) + 'px';
            ref.current.style.height =
              resize[1] + (border?.top || 0) + (border?.bottom || 0) + 'px';
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
    >
      {showPlaceholder &&
        renderResourcePlaceholder &&
        renderResourcePlaceholder(resource)}
      {children}
      {overlay && <Overlay backgroundColor={overlay} />}
    </Element>
  );
}

export default MediaDisplay;
