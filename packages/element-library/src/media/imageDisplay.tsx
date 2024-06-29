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
import {
  calculateSrcSet,
  getMediaSizePositionProps,
  getSmallestUrlForWidth,
  preloadImage,
  type ResourceCacheEntry,
  ResourceCacheEntryType,
  resourceList,
} from '@googleforcreators/media';
import type { ImageElement, DisplayProps } from '@googleforcreators/elements';
import type { HTMLProps } from 'react';

/**
 * Internal dependencies
 */
import { mediaWithScale } from './util';
import MediaDisplay from './display';

const Image = styled.img`
  position: absolute;
  ${mediaWithScale}
`;

const noop = () => false;

function ImageDisplay({
  element,
  box,
  previewMode,
  getProxiedUrl,
  isCurrentResourceProcessing = noop,
  isCurrentResourceUploading = noop,
  renderResourcePlaceholder,
}: DisplayProps<ImageElement>) {
  const { resource, scale, focalX, focalY } = element;
  const { id: resourceId, alt } = resource;
  const { width, height } = box;
  const ref = useRef<HTMLImageElement>(null);

  let initialSrcType = 'smallest';
  let initialSrc: string | null = getSmallestUrlForWidth(0, resource);

  if (resourceList.get(resourceId)?.type === ResourceCacheEntryType.Cached) {
    initialSrcType = 'cached';
    initialSrc = (resourceList.get(resourceId) as ResourceCacheEntry).url;
  }

  if (
    resourceList.get(resourceId)?.type === ResourceCacheEntryType.Fullsize ||
    isCurrentResourceProcessing(resourceId) ||
    isCurrentResourceUploading(resourceId)
  ) {
    initialSrcType = 'fullsize';
    initialSrc = resource.src;
  }

  initialSrc = getProxiedUrl(resource, initialSrc);

  const [srcType, setSrcType] = useState(initialSrcType);
  const [src, setSrc] = useState<string | null>(initialSrc);
  const srcSet = srcType === 'fullsize' ? calculateSrcSet(resource) : '';

  const imgProps: HTMLProps<HTMLImageElement> = getMediaSizePositionProps(
    resource,
    width,
    height,
    scale,
    focalX,
    focalY
  );

  imgProps.crossOrigin = 'anonymous';

  useEffect(() => {
    let timeout: number;
    let mounted = true;
    if (
      resourceList.get(resourceId)?.type !== ResourceCacheEntryType.Fullsize &&
      resource.src
    ) {
      timeout = window.setTimeout(() => {
        void (async () => {
          const url: string = getProxiedUrl(resource, resource.src) as string;
          try {
            const preloadedImg = await preloadImage({
              src: url,
              srcset: srcSet || undefined,
            });
            if (mounted) {
              resourceList.set(resource.id, {
                type: ResourceCacheEntryType.Fullsize,
                url,
              });
              setSrc(preloadedImg.currentSrc);
              setSrcType(ResourceCacheEntryType.Fullsize);
            }
          } catch {
            // Ignore
          }
        })();
      });
    } else {
      setSrc(getProxiedUrl(resource, resource.src));
    }
    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [getProxiedUrl, resource, srcSet, srcType, resourceId]);

  const showPlaceholder = srcType !== 'fullsize' || resource.isPlaceholder;

  return (
    <MediaDisplay<ImageElement>
      element={element}
      mediaRef={ref}
      showPlaceholder={showPlaceholder}
      previewMode={previewMode}
      renderResourcePlaceholder={renderResourcePlaceholder}
    >
      <Image
        // @ts-expect-error TODO: Investigate.
        ref={ref}
        draggable={false}
        decoding="sync"
        src={src || undefined}
        srcSet={srcSet || undefined}
        alt={alt}
        data-testid="imageElement"
        data-leaf-element="true"
        {...imgProps}
      />
    </MediaDisplay>
  );
}

export default ImageDisplay;
