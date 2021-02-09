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
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { getSmallestUrlForWidth } from '../../../../../elements/media/util';
import useAverageColor from '../../../../../elements/media/useAverageColor';
import StoryPropTypes from '../../../../../types';
import LibraryMoveable from '../../shared/libraryMoveable';
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
  background: ${({ theme }) => rgba(theme.colors.bg.primary, 0.6)};
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.duration.family};
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.duration.size};
  line-height: ${({ theme }) =>
    theme.DEPRECATED_THEME.fonts.duration.lineHeight};
  letter-spacing: ${({ theme }) =>
    theme.DEPRECATED_THEME.fonts.duration.letterSpacing};
  padding: 0 6px;
  border-radius: 10px;
`;

const HiddenPosterImage = styled.img`
  display: none;
`;

const CloneImg = styled.img`
  opacity: 0;
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  position: absolute;
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
  active,
}) {
  const newVideoPosterRef = useRef(null);
  const hiddenPoster = useRef(null);
  const mediaBaseColor = useRef(null);

  const {
    state: { draggingResource },
    actions: { handleDrag, handleDrop, setDraggingResource },
  } = useDropTargets();

  // Get the base color of the media for using when adding a new image,
  // needed for example when droptargeting to bg.
  const setAverageColor = (color) => {
    mediaBaseColor.current = color;
  };

  useAverageColor(
    type === 'video' ? hiddenPoster : mediaElement,
    setAverageColor
  );

  useEffect(() => {
    if (resource.poster && resource.poster.includes('blob')) {
      newVideoPosterRef.current = resource.poster;
    }
  }, [resource.poster]);

  const makeMediaVisible = () => {
    if (mediaElement.current) {
      mediaElement.current.style.opacity = 1;
    }
  };
  let media;
  const cloneProps = {
    width: width,
    height: height,
    alt: alt,
    'aria-label': alt,
    loading: 'lazy',
    draggable: false,
  };
  const thumbnailURL = getSmallestUrlForWidth(width, resource);
  const { lengthFormatted, poster, mimeType } = resource;
  if (['image', 'gif'].includes(type)) {
    media = (
      <Image
        key={src}
        src={thumbnailURL}
        ref={mediaElement}
        width={width}
        height={height}
        alt={alt}
        aria-label={alt}
        loading={'lazy'}
        onLoad={makeMediaVisible}
        draggable={false}
      />
    );
    cloneProps.src = thumbnailURL;
  } else if (type === 'video') {
    const displayPoster = poster ? poster : newVideoPosterRef.current;
    media = (
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
          showWithoutDelay={newVideoPosterRef.current}
        >
          <source
            src={getSmallestUrlForWidth(width, resource)}
            type={mimeType}
          />
        </Video>
        {/* This hidden image allows us to fade in the poster image in the
        gallery as there's no event when a video's poster loads. */}
        {!newVideoPosterRef.current && (
          <HiddenPosterImage
            ref={hiddenPoster}
            src={poster}
            onLoad={makeMediaVisible}
          />
        )}
        {showVideoDetail && <Duration>{lengthFormatted}</Duration>}
      </>
    );
    cloneProps.src = poster;
  }
  if (!media) {
    throw new Error('Invalid media element type.');
  }

  const dragHandler = (event) => {
    if (type === 'video' && !mediaElement.current?.paused) {
      mediaElement.current.pause();
    }
    if (!draggingResource) {
      // Drop-targets handling.
      resourceList.set(resource.id, {
        url: thumbnailURL,
        type: 'cached',
      });
      setDraggingResource(resource);
    }
    handleDrag(resource, event.clientX, event.clientY);
  };

  return (
    <>
      {media}
      <LibraryMoveable
        active={active}
        handleDrag={dragHandler}
        handleDragEnd={() => {
          handleDrop({
            ...resource,
            baseColor: mediaBaseColor.current,
          });
        }}
        type={resource.type}
        elementProps={{
          resource: {
            ...resource,
            baseColor: mediaBaseColor.current,
          },
        }}
        onClick={onClick(
          type === 'image' ? thumbnailURL : poster,
          mediaBaseColor.current
        )}
        cloneElement={CloneImg}
        cloneProps={cloneProps}
      />
    </>
  );
}

InnerElement.propTypes = {
  type: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  resource: StoryPropTypes.imageResource,
  alt: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  showVideoDetail: PropTypes.bool,
  mediaElement: PropTypes.object,
  active: PropTypes.bool.isRequired,
};

export default InnerElement;
