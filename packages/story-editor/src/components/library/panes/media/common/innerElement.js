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
import { useEffect, useRef, memo } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import {
  getSmallestUrlForWidth,
  resourceList,
  ResourcePropTypes,
} from '@googleforcreators/media';
import {
  Icons,
  Text,
  THEME_CONSTANTS,
  noop,
  Image as RawImage,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import LibraryMoveable from '../../shared/libraryMoveable';
import { useDropTargets } from '../../../../dropTargets';
import { ContentType } from '../../../../../app/media';
import InsertionOverlay from '../../shared/insertionOverlay';

const styledTiles = css`
  width: 100%;
  cursor: pointer;
  transition: 0.2s transform, 0.15s opacity;
  border-radius: 4px;
  opacity: 0;
`;

const Image = styled(RawImage)`
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
const MuteWrapper = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  height: 24px;
  width: 24px;
  background: ${({ theme }) => theme.colors.opacity.black64};
  color: ${({ theme }) => theme.colors.fg.primary};
  border-radius: 100px;
`;
const Duration = styled(Text).attrs({
  forwardedAs: 'span',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.primary};
  display: block;
`;

const CloneImg = styled(RawImage)`
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
  onLoad = noop,
  showVideoDetail,
  mediaElement,
  active,
  isMuted,
}) {
  const newVideoPosterRef = useRef(null);
  // Track if we have already set the dragging resource.
  const hasSetResourceTracker = useRef(null);

  // Note: This `useDropTargets` is purposefully separated from the one below since it
  // uses a custom function for checking for equality and is meant for `handleDrag` and `handleDrop` only.
  const { handleDrag, handleDrop } = useDropTargets(
    ({ state, actions }) => ({
      handleDrag: actions.handleDrag,
      handleDrop: actions.handleDrop,
      dropTargets: state.dropTargets,
      activeDropTargetId: state.activeDropTargetId,
    }),
    (prev, curr) => {
      // If we're dragging this element, always update the actions.
      if (hasSetResourceTracker.current) {
        return false;
        // If we're rendering the first time, init `handleDrag` and `handleDrop`.
      } else if (hasSetResourceTracker.current === null) {
        hasSetResourceTracker.current = false;
        return false;
      }
      // If the drop targets updated meanwhile, also update the actions, otherwise `handleDrag` won't consider those.
      if (prev?.dropTargets && curr?.dropTargets) {
        const prevIds = Object.keys(prev.dropTargets);
        const currentIds = Object.keys(curr.dropTargets);
        if (prevIds.join() !== currentIds.join()) {
          return false;
        }
      }

      if (prev?.activeDropTargetId !== curr?.activeDropTargetId) {
        return false;
      }

      // Otherwise ignore the changes in the actions.
      return true;
    }
  );

  const { setDraggingResource } = useDropTargets(
    ({ actions: { setDraggingResource } }) => ({
      setDraggingResource,
    })
  );

  useEffect(() => {
    // assign display poster for videos
    if (resource.poster) {
      newVideoPosterRef.current = resource.poster;
    }
  }, [resource.poster]);

  const makeMediaVisible = () => {
    if (mediaElement.current) {
      mediaElement.current.style.opacity = 1;
    }
    onLoad();
  };

  let media;
  const { lengthFormatted, poster, mimeType } = resource;
  const displayPoster = poster ?? newVideoPosterRef.current;
  const thumbnailURL = displayPoster
    ? displayPoster
    : getSmallestUrlForWidth(width, resource);

  const commonProps = {
    width,
    height,
    alt,
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
    title: alt,
    alt: null,
    loop: type === ContentType.GIF,
    muted: true,
    preload: 'metadata',
    poster: displayPoster,
    showWithoutDelay: active,
  };

  if (type === ContentType.IMAGE) {
    media = <Image key={src} ref={mediaElement} {...imageProps} />;
    cloneProps.src = thumbnailURL;
  } else if ([ContentType.VIDEO, ContentType.GIF].includes(type)) {
    media = (
      <>
        {poster && !active ? (
          <Image key={src} ref={mediaElement} {...imageProps} />
        ) : (
          // eslint-disable-next-line jsx-a11y/media-has-caption,styled-components-a11y/media-has-caption -- No captions/tracks because video is muted.
          <Video key={src} {...videoProps} ref={mediaElement}>
            {type === ContentType.GIF ? (
              resource.output.src && (
                <source
                  src={resource.output.src}
                  type={resource.output.mimeType}
                />
              )
            ) : (
              <source
                src={getSmallestUrlForWidth(width, resource)}
                type={mimeType}
              />
            )}
          </Video>
        )}
        {type === ContentType.VIDEO && showVideoDetail && lengthFormatted && (
          <DurationWrapper>
            <Duration>{lengthFormatted}</Duration>
          </DurationWrapper>
        )}
        {type === ContentType.VIDEO && showVideoDetail && isMuted && (
          <MuteWrapper>
            <Icons.Muted />
          </MuteWrapper>
        )}
      </>
    );
    cloneProps.src = poster;
  }

  if (!media) {
    throw new Error('Invalid media element type.');
  }

  const dragHandler = (event) => {
    if (!hasSetResourceTracker.current) {
      // Drop-targets handling.
      resourceList.set(resource.id, {
        url: thumbnailURL,
        type: 'cached',
      });
      setDraggingResource(resource);
      hasSetResourceTracker.current = true;
    }
    handleDrag(resource, event.clientX, event.clientY);
  };

  const imageURL = type === ContentType.IMAGE ? thumbnailURL : poster;

  return (
    <>
      {media}
      {active && <InsertionOverlay showIcon={false} />}
      <LibraryMoveable
        active={active}
        handleDrag={dragHandler}
        handleDragEnd={() => {
          handleDrop(resource);
          hasSetResourceTracker.current = false;
        }}
        type={resource.type}
        elementProps={{ resource }}
        onClick={onClick(imageURL)}
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
  isMuted: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  onLoad: PropTypes.func,
  showVideoDetail: PropTypes.bool,
  mediaElement: PropTypes.object,
  active: PropTypes.bool.isRequired,
};

export default memo(InnerElement);
