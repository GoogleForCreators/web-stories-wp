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
import styled, { css } from 'styled-components';
import { rgba } from 'polished';
import { useCallback, useEffect, useMemo, useRef } from 'react';

/**
 * Internal dependencies
 */
import { getSmallestUrlForWidth } from '../../../../../elements/media/util';
import resourceList from '../../../../../utils/resourceList';
import { useDropTargets } from '../../../../dropTargets';

const styledTiles = css`
  width: 100%;
  cursor: pointer;
  transition: 0.2s transform, 0.15s opacity;
  border-radius: 4px;
  opacity: 0;
`;

const Image = styled.img`
  ${styledTiles}
`;

// Display the newly uploaded videos without a delay: showWithoutDelay
const Video = styled.video`
  ${styledTiles}
  object-fit: cover;
  ${({ showWithoutDelay }) => (showWithoutDelay ? 'opacity: 1;' : '')}
`;

const Duration = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: ${({ theme }) => rgba(theme.colors.bg.workspace, 0.6)};
  font-family: ${({ theme }) => theme.fonts.duration.family};
  font-size: ${({ theme }) => theme.fonts.duration.size};
  line-height: ${({ theme }) => theme.fonts.duration.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.duration.letterSpacing};
  padding: 0 6px;
  border-radius: 10px;
`;

const HiddenPosterImage = styled.img`
  display: none;
`;

function InnerElement({
  type,
  src,
  resource,
  alt,
  width,
  height,
  onClick,
  showVideoDetail,
  mediaElement,
}) {
  const newVideoPosterRef = useRef(null);

  useEffect(() => {
    if (resource.poster && resource.poster.includes('blob')) {
      newVideoPosterRef.current = resource.poster;
    }
  }, [resource.poster]);

  const {
    actions: { handleDrag, handleDrop, setDraggingResource },
  } = useDropTargets();

  const measureMediaElement = useCallback(
    () => mediaElement?.current?.getBoundingClientRect(),
    [mediaElement]
  );

  const dropTargetsBindings = useMemo(
    () => (thumbnailURL) => ({
      draggable: 'true',
      onDragStart: (e) => {
        resourceList.set(resource.id, {
          url: thumbnailURL,
          type: 'cached',
        });
        setDraggingResource(resource);
        const { x, y, width: w, height: h } = measureMediaElement();
        const offsetX = e.clientX - x;
        const offsetY = e.clientY - y;
        e.dataTransfer.setDragImage(mediaElement?.current, offsetX, offsetY);
        e.dataTransfer.setData(
          'resource/media',
          JSON.stringify({
            resource,
            offset: { x: offsetX, y: offsetY, w, h },
          })
        );
      },
      onDrag: (e) => {
        handleDrag(resource, e.clientX, e.clientY);
      },
      onDragEnd: (e) => {
        e.preventDefault();
        setDraggingResource(null);
        handleDrop(resource);
      },
    }),
    [
      resource,
      setDraggingResource,
      measureMediaElement,
      mediaElement,
      handleDrag,
      handleDrop,
    ]
  );

  const makeMediaVisible = () => {
    if (mediaElement.current) {
      mediaElement.current.style.opacity = 1;
    }
  };
  if (['image', 'gif'].includes(type)) {
    const thumbnailURL = getSmallestUrlForWidth(width, resource);
    return (
      <Image
        key={src}
        src={thumbnailURL}
        ref={mediaElement}
        width={width}
        height={height}
        alt={alt}
        aria-label={alt}
        loading={'lazy'}
        onClick={onClick(thumbnailURL)}
        onLoad={makeMediaVisible}
        {...dropTargetsBindings(thumbnailURL)}
      />
    );
  } else if (type === 'video') {
    const { lengthFormatted, poster, mimeType } = resource;
    const displayPoster = poster ? poster : newVideoPosterRef.current;
    return (
      <>
        <Video
          key={src}
          ref={mediaElement}
          poster={displayPoster}
          width={width}
          height={height}
          preload="none"
          aria-label={alt}
          muted
          onClick={onClick(poster)}
          showWithoutDelay={newVideoPosterRef.current}
          {...dropTargetsBindings(poster)}
        >
          <source
            src={getSmallestUrlForWidth(width, resource)}
            type={mimeType}
          />
        </Video>
        {/* This hidden image allows us to fade in the poster image in the
        gallery as there's no event when a video's poster loads. */}
        {!newVideoPosterRef.current && (
          <HiddenPosterImage src={poster} onLoad={makeMediaVisible} />
        )}
        {showVideoDetail && <Duration>{lengthFormatted}</Duration>}
      </>
    );
  }
  throw new Error('Invalid media element type.');
}

export default InnerElement;
