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

const MediaWrapper = styled.div`
  position: absolute;
`;

const CloneImg = styled.img`
  opacity: 1;
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  position: absolute;
`;

const TargetBox = styled.div`
  position: absolute;
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
}) {
  const newVideoPosterRef = useRef(null);
  const hiddenPoster = useRef(null);
  const mediaBaseColor = useRef(null);
  const mediaWrapper = useRef(null);
  const targetBoxRef = useRef(null);
  const overlayRef = useRef(null);

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
  const thumbnailURL = getSmallestUrlForWidth(width, resource);
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
  } else if (type === 'video') {
    const { lengthFormatted, poster, mimeType } = resource;
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
          onClick={onClick(poster, mediaBaseColor.current)}
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
  }
  if (!media) {
    throw new Error('Invalid media element type.');
  }

  // @todo Make it work for video, too.
  // @todo Move the whole clone and target part to Moveable, too.
  return (
    <>
      <MediaWrapper ref={mediaWrapper} zIndex={10}>
        <TargetBox ref={targetBoxRef} width={width} height={height} />
        {media}
      </MediaWrapper>
      {mediaElement.current && (
        <LibraryMoveable
          overlayRef={overlayRef}
          targetBoxRef={targetBoxRef}
          mediaBaseColor={mediaBaseColor}
          resource={resource}
          thumbnailURL={thumbnailURL}
          onClick={onClick(thumbnailURL, mediaBaseColor.current)}
          cloneElement={CloneImg}
          cloneProps={{
            src: thumbnailURL,
            width: width,
            height: height,
            alt: alt,
            'aria-label': alt,
            loading: 'lazy',
            draggable: false,
          }}
        />
      )}
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
};

export default InnerElement;
