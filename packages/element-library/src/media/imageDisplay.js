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
import { useEffect, useRef, useState } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import {
  preloadImage,
  resourceList,
  getMediaSizePositionProps,
  calculateSrcSet,
  getSmallestUrlForWidth,
} from '@googleforcreators/media';
import { StoryPropTypes } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { noop } from '../utils/noop';
import { mediaWithScale } from './util';
import MediaDisplay from './display';

const Img = styled.img`
  position: absolute;
  ${mediaWithScale}
`;

function ImageDisplay({
  element,
  box,
  previewMode,
  getProxiedUrl,
  isCurrentResourceProcessing = noop,
  isCurrentResourceUploading = noop,
  renderResourcePlaceholder,
}) {
  const { resource, scale, focalX, focalY } = element;
  const { id: resourceId, alt } = resource;
  const { width, height } = box;
  const ref = useRef();

  let initialSrcType = 'smallest';
  let initialSrc = getSmallestUrlForWidth(0, resource);

  if (resourceList.get(resourceId)?.type === 'cached') {
    initialSrcType = 'cached';
    initialSrc = resourceList.get(resourceId).url;
  }

  if (
    resourceList.get(resourceId)?.type === 'fullsize' ||
    isCurrentResourceProcessing(resourceId) ||
    isCurrentResourceUploading(resourceId)
  ) {
    initialSrcType = 'fullsize';
    initialSrc = resource.src;
  }

  initialSrc = getProxiedUrl(resource, initialSrc);

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

  imgProps.crossOrigin = 'anonymous';

  useEffect(() => {
    let timeout;
    let mounted = true;
    if (resourceList.get(resourceId)?.type !== 'fullsize' && resource.src) {
      timeout = setTimeout(async () => {
        const url = getProxiedUrl(resource, resource.src);
        try {
          const preloadedImg = await preloadImage({ src: url, srcset: srcSet });
          if (mounted) {
            resourceList.set(resource.id, {
              type: 'fullsize',
            });
            setSrc(preloadedImg.currentSrc);
            setSrcType('fullsize');
          }
        } catch {
          // Ignore
        }
      });
    } else {
      setSrc(getProxiedUrl(resource, resource.src));
    }
    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [getProxiedUrl, resource, srcSet, srcType, resourceId]);

  const showPlaceholder = srcType !== 'fullsize';

  return (
    <MediaDisplay
      box={box}
      element={element}
      mediaRef={ref}
      showPlaceholder={showPlaceholder}
      previewMode={previewMode}
      renderResourcePlaceholder={renderResourcePlaceholder}
    >
      <Img
        ref={ref}
        draggable={false}
        decoding="sync"
        src={src}
        srcSet={srcSet}
        alt={alt}
        data-testid="imageElement"
        data-leaf-element="true"
        {...imgProps}
      />
    </MediaDisplay>
  );
}

ImageDisplay.propTypes = {
  element: StoryPropTypes.elements.image.isRequired,
  box: StoryPropTypes.box.isRequired,
  previewMode: PropTypes.bool,
  getProxiedUrl: PropTypes.func.isRequired,
  isCurrentResourceProcessing: PropTypes.func,
  isCurrentResourceUploading: PropTypes.func,
  renderResourcePlaceholder: PropTypes.func,
};

export default ImageDisplay;
