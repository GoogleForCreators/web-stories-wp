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
import { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { getSmallestUrlForWidth } from '../../../../../elements/media/util';
import resourceList from '../../../../../utils/resourceList';
import { useDropTargets } from '../../../../dropTargets';
import useAverageColor from '../../../../../elements/media/useAverageColor';
import Moveable from '../../../../moveable';
import InOverlay from '../../../../overlay';
import useInsertElement from '../../../../canvas/useInsertElement';
import { editorToDataX, editorToDataY } from '../../../../../units';
import { useTransform } from '../../../../transform';
import { useLayout } from '../../../../../app/layout';
import StoryPropTypes from '../../../../../types';

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
  z-index: 99999;
  position: absolute;
`;

const CloneImg = styled.img`
  opacity: 1;
  width: 100px;
  height: 100px;
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
  const cloneRef = useRef(null);
  const overlayRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const { pageSize } = useLayout(({ state }) => ({
    pageSize: state.canvasPageSize,
  }));

  const insertElement = useInsertElement();
  const { pageContainer } = useTransform((state) => ({
    pageContainer: state.state.pageContainer,
  }));

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

  const {
    state: { activeDropTargetId },
    actions: { handleDrag, handleDrop, setDraggingResource },
  } = useDropTargets();

  const measureMediaElement = useCallback(
    () => mediaElement?.current?.getBoundingClientRect(),
    [mediaElement]
  );

  const frame = {
    translate: [0, 0],
  };

  const onDragStart = ({ set }) => {
    // Note: we can't set isDragging true here since a "click" is also considered dragStart.
    set(frame.translate);
    setIsDragging(true);

    // Position the clone that's being dragged.
    const overlay = overlayRef.current;
    let offsetX1 = 0,
      offsetY1 = 0;
    for (
      let offsetNode = overlay;
      offsetNode;
      offsetNode = offsetNode.offsetParent
    ) {
      offsetX1 += offsetNode.offsetLeft;
      offsetY1 += offsetNode.offsetTop;
    }
    const mediaBox = measureMediaElement();
    const x1 = mediaBox.top - offsetX1;
    const y1 = mediaBox.left - offsetY1;
    cloneRef.current.style.top = `${x1}px`;
    cloneRef.current.style.left = `${y1}px`;
    cloneRef.current.style.width = `${mediaBox.width}px`;
    cloneRef.current.style.height = `${mediaBox.height}px`;

    // Drop-targets handling.
    resourceList.set(resource.id, {
      url: thumbnailURL,
      type: 'cached',
    });
    setDraggingResource(resource);
  };

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
        onClick={onClick(thumbnailURL, mediaBaseColor.current)}
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
  return (
    <>
      <MediaWrapper ref={mediaWrapper} zIndex={10}>
        {media}
        {isDragging && (
          <InOverlay
            ref={overlayRef}
            zIndex={3}
            pointerEvents="initial"
            render={() => {
              return (
                <CloneImg
                  src={thumbnailURL}
                  ref={cloneRef}
                  width={width}
                  height={height}
                  alt={alt}
                  aria-label={alt}
                  loading={'lazy'}
                  draggable={false}
                />
              );
            }}
          />
        )}
      </MediaWrapper>
      <Moveable
        className=""
        zIndex={10}
        target={mediaWrapper.current}
        edge={true}
        draggable={true}
        origin={false}
        pinchable={true}
        onDragStart={onDragStart}
        snappable={true}
        verticalGuidelines={[0, 100, 300, 400]}
        onDrag={({ beforeTranslate, inputEvent }) => {
          frame.translate = beforeTranslate;
          if (cloneRef.current) {
            cloneRef.current.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
          }
          handleDrag(resource, inputEvent.clientX, inputEvent.clientY);
        }}
        onDragEnd={() => {
          if (activeDropTargetId) {
            handleDrop({
              ...resource,
              baseColor: mediaBaseColor.current,
            });
          } else {
            const {
              x,
              y,
              width: w,
              height: h,
            } = cloneRef.current.getBoundingClientRect();
            const {
              x: pageX,
              y: pageY,
            } = pageContainer.getBoundingClientRect();

            insertElement(resource.type, {
              resource,
              x: editorToDataX(x - pageX, pageSize.width),
              y: editorToDataY(y - pageY, pageSize.height),
              width: editorToDataX(w, pageSize.width),
              height: editorToDataY(h, pageSize.height),
            });
          }
          setIsDragging(false);
          setDraggingResource(null);
        }}
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
  mediaElement: StoryPropTypes.mediaElement,
};

export default InnerElement;
