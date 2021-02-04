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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import { preloadImage } from '../../app/media/utils';
import resourceList from '../../utils/resourceList';
import {
  calculateSrcSet,
  getSmallestUrlForWidth,
  mediaWithScale,
} from './util';
import MediaDisplay from './display';
import { getMediaSizePositionProps } from '.';

const Img = styled.img`
  position: absolute;
  ${mediaWithScale}
`;

function ImageDisplay({ element, box, previewMode }) {
  const { resource, scale, focalX, focalY } = element;
  const { width, height } = box;
  const ref = useRef();

  let initialSrcType = 'smallest';
  let initialSrc = getSmallestUrlForWidth(0, resource);

  if (resourceList.get(resource.id)?.type === 'cached') {
    initialSrcType = 'cached';
    initialSrc = resourceList.get(resource.id).url;
  }

  if (resourceList.get(resource.id)?.type === 'fullsize' || resource.local) {
    initialSrcType = 'fullsize';
    initialSrc = resource.src;
  }

  const [srcType, setSrcType] = useState(initialSrcType);
  const [src, setSrc] = useState(initialSrc);
  const srcSet = srcType === 'fullsize' ? calculateSrcSet(resource) : '';

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
    let mounted = true;
    if (resourceList.get(resource.id)?.type !== 'fullsize') {
      timeout = setTimeout(async () => {
        const preloadedImg = await preloadImage(resource.src, srcSet);
        if (mounted) {
          resourceList.set(resource.id, {
            type: 'fullsize',
          });
          setSrc(preloadedImg.currentSrc);
          setSrcType('fullsize');
        }
      });
    }
    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [resource.id, resource.src, srcSet, srcType]);

  const showPlaceholder = srcType !== 'fullsize';

  return (
    <MediaDisplay
      element={element}
      mediaRef={ref}
      showPlaceholder={showPlaceholder}
      previewMode={previewMode}
    >
      <Img
        ref={ref}
        draggable={false}
        src={src}
        srcSet={srcSet}
        alt={resource.alt}
        data-testid="imageElement"
        data-leaf-element="true"
        {...imgProps}
      />
    </MediaDisplay>
  );
}

ImageDisplay.propTypes = {
  element: PropTypes.oneOfType([
    StoryPropTypes.elements.image,
    StoryPropTypes.elements.gif,
  ]).isRequired,
  box: StoryPropTypes.box.isRequired,
  previewMode: PropTypes.bool,
};

export default ImageDisplay;
