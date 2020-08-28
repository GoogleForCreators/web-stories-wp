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
import { useEffect, useRef, useState } from 'react';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import {
  calculateSrcSet,
  getSmallestUrlForWidth,
  mediaWithScale,
} from '../media/util';
import { getMediaSizePositionProps } from '../media';
import MediaDisplay from '../media/display';
import { preloadImage } from '../../app/media/utils';
import resourceList from '../../utils/resourceList';

const Img = styled.img`
  position: absolute;
  ${mediaWithScale}
`;

function ImageDisplay({ element, box }) {
  const { resource, scale, focalX, focalY } = element;
  const { width, height } = box;
  const ref = useRef();

  let initialSrcType = 'smallest';
  let initialSrc = getSmallestUrlForWidth(0, resource);

  if (resourceList[resource.id]?.type === 'cached') {
    initialSrcType = 'cached';
    initialSrc = resourceList[resource.id].url;
  }

  if (resourceList[resource.id]?.type === 'fullsize' || resource.local) {
    initialSrcType = 'fullsize';
    initialSrc = resource.src;
  }

  const [srcType, setSrcType] = useState(initialSrcType);
  const [src, setSrc] = useState(initialSrc);
  const srcSet = srcType === 'fullsize' && calculateSrcSet(resource);

  const imgProps = getMediaSizePositionProps(
    resource,
    width,
    height,
    scale,
    focalX,
    focalY
  );

  useEffect(() => {
    let timeout;
    if (resourceList[resource.id]?.type !== 'fullsize') {
      timeout = setTimeout(async () => {
        const preloadedImg = await preloadImage(resource.src, srcSet);
        resourceList[resource.id] = {
          type: 'fullsize',
        };
        setSrc(preloadedImg.currentSrc);
        setSrcType('fullsize');
      });
    }

    return () => clearTimeout(timeout);
  }, [resource.id, resource.src, srcSet, srcType]);

  return (
    <MediaDisplay element={element} mediaRef={ref}>
      <Img
        ref={ref}
        draggable={false}
        src={src}
        srcSet={srcSet}
        alt={resource.alt}
        {...imgProps}
      />
    </MediaDisplay>
  );
}

ImageDisplay.propTypes = {
  element: StoryPropTypes.elements.image.isRequired,
  box: StoryPropTypes.box.isRequired,
};

export default ImageDisplay;
