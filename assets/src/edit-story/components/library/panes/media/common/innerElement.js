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
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  getSmallestUrlForWidth,
  resourceList,
  ResourcePropTypes,
} from '@web-stories-wp/media';
/**
 * Internal dependencies
 */
import useAverageColor from '../../../../../elements/media/useAverageColor';
import LibraryMoveable from '../../shared/libraryMoveable';
import { useDropTargets } from '../../../../dropTargets';
import { ContentType } from '../../../../../app/media';
import { Text, THEME_CONSTANTS } from '../../../../../../design-system';

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

const DurationWrapper = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: ${({ theme }) => theme.colors.opacity.black64};
  border-radius: 100px;
  height: 18px;
  padding: 0 6px;
`;
const Duration = styled(Text).attrs({
  forwardedAs: 'span',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.primary};
  display: block;
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
    [ContentType.VIDEO, ContentType.GIF].includes(type)
      ? hiddenPoster
      : mediaElement,
    setAverageColor
  );

  useEffect(() => {
    // assign display poster for videos
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
  const { lengthFormatted, poster, mimeType, output } = resource;
  const posterSrc = type === ContentType.GIF ? output.poster : poster;
  const displayPoster = posterSrc ?? newVideoPosterRef.current;

  const commonProps = {
    width: width,
    height: height,
    alt: alt,
    crossOrigin: 'anonymous',
  };

  const commonImageProps = {
    ...commonProps,
    onLoad: makeMediaVisible,
    loading: 'lazy',
    draggable: false,
  };

  const cloneProps = {
    ...commonImageProps,
    onLoad: undefined,
  };

  const imageProps = {
    ...commonImageProps,
    src: thumbnailURL,
  };
  const videoProps = {
    ...commonProps,
    'aria-label': alt,
    alt: null,
    loop: type === ContentType.GIF,
    muted: true,
    preload: 'metadata',
    poster: displayPoster,
    showWithoutDelay: Boolean(newVideoPosterRef.current),
  };

  if (type === ContentType.IMAGE) {
    // eslint-disable-next-line styled-components-a11y/alt-text
    media = <Image key={src} {...imageProps} ref={mediaElement} />;
    cloneProps.src = thumbnailURL;
  } else if ([ContentType.VIDEO, ContentType.GIF].includes(type)) {
    media = (
      <>
        {/* eslint-disable-next-line styled-components-a11y/media-has-caption -- No captions because video is muted. */}
        <Video key={src} {...videoProps} ref={mediaElement}>
          {type === ContentType.GIF ? (
            <>
              <source
                src={getSmallestUrlForWidth(width, {
                  ...resource,
                  sizes: resource.output.sizes.mp4,
                })}
                type="video/mp4"
              />
              <source
                src={getSmallestUrlForWidth(width, {
                  ...resource,
                  sizes: resource.output.sizes.webm,
                })}
                type="video/webm"
              />
            </>
          ) : (
            <source
              src={getSmallestUrlForWidth(width, resource)}
              type={mimeType}
            />
          )}
        </Video>
        {!newVideoPosterRef.current && (
          /* eslint-disable-next-line styled-components-a11y/alt-text -- False positive. */
          <HiddenPosterImage
            ref={hiddenPoster}
            src={posterSrc}
            {...commonImageProps}
          />
        )}
        {type === ContentType.VIDEO && showVideoDetail && lengthFormatted && (
          <DurationWrapper>
            <Duration>{lengthFormatted}</Duration>
          </DurationWrapper>
        )}
      </>
    );
    cloneProps.src = posterSrc;
  }
  if (!media) {
    throw new Error('Invalid media element type.');
  }

  const dragHandler = (event) => {
    if (
      [ContentType.VIDEO, ContentType.GIF].includes(type) &&
      !mediaElement.current?.paused
    ) {
      mediaElement.current?.pause();
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
          type === ContentType.IMAGE ? thumbnailURL : posterSrc,
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
  resource: ResourcePropTypes.imageResource,
  alt: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  showVideoDetail: PropTypes.bool,
  mediaElement: PropTypes.object,
  active: PropTypes.bool.isRequired,
};

export default InnerElement;
