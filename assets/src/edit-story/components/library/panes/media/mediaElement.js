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
import styled, { keyframes, css } from 'styled-components';
import PropTypes from 'prop-types';
import { memo, useState, useRef, useMemo } from 'react';
import { CSSTransition } from 'react-transition-group';
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
import { useDropTargets } from '../../../../app';
import { ReactComponent as Play } from '../../../../icons/play.svg';

const styledTiles = css`
  width: 100%;
  transition: 0.2s transform, 0.15s opacity;
  margin-bottom: 10px;
`;

const Image = styled.img`
  ${styledTiles}
`;

const Video = styled.video`
  ${styledTiles}
  object-fit: cover;
`;

const Container = styled.div`
  position: relative;
  display: flex;
`;

const PlayIcon = styled(Play)`
  height: 24px;
  position: absolute;
  width: 24px;
  top: calc(50% - 12px);
  left: calc(50% - 12px);
`;
const Duration = styled.div`
  position: absolute;
  bottom: 12px;
  left: 10px;
  background: ${({ theme }) => rgba(theme.colors.bg.v1, 0.6)};
  font-family: ${({ theme }) => theme.fonts.duration.family};
  font-size: ${({ theme }) => theme.fonts.duration.size};
  line-height: ${({ theme }) => theme.fonts.duration.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.duration.letterSpacing};
  padding: 2px 8px;
  border-radius: 8px;
`;

const gradientAnimation = keyframes`
    0% { background-position:0% 50% }
    50% { background-position:100% 50% }
    100% { background-position:0% 50% }
`;

const UploadingIndicator = styled.div`
  height: 4px;
  background: linear-gradient(
    270deg,
    ${({ theme }) => theme.colors.loading.primary} 15%,
    ${({ theme }) => theme.colors.loading.secondary} 50%,
    ${({ theme }) => theme.colors.loading.primary} 85%
  );
  background-size: 400% 400%;
  position: absolute;
  bottom: 10px;

  animation: ${gradientAnimation} 4s ease infinite;

  &.uploading-indicator {
    &.appear {
      width: 0;
    }

    &.appear-done {
      width: 100%;
      transition: 1s ease-out;
      transition-property: width;
    }
  }
`;

/**
 * Get a formatted element for different media types.
 *
 * @param {Object} param Parameters object
 * @param {Object} param.resource Resource object
 * @param {number} param.width Width that element is inserted into editor.
 * @param {number} param.height Height that element is inserted into editor.
 * @return {null|*} Element or null if does not map to video/image.
 */
const MediaElement = ({
  resource,
  width: requestedWidth,
  height: requestedHeight,
  onInsert,
}) => {
  const {
    id: resourceId,
    src,
    type,
    width: originalWidth,
    height: originalHeight,
    sizes,
    local,
    alt,
  } = resource;
  const oRatio =
    originalWidth && originalHeight ? originalWidth / originalHeight : 1;
  const width = requestedWidth || requestedHeight / oRatio;
  const height = requestedHeight || width / oRatio;

  const mediaElement = useRef();
  const [showVideoDetail, setShowVideoDetail] = useState(true);

  const {
    actions: { handleDrag, handleDrop, setDraggingResource },
  } = useDropTargets();

  const measureMediaElement = () =>
    mediaElement?.current?.getBoundingClientRect();

  const dropTargetsBindings = useMemo(
    () => ({
      draggable: 'true',
      onDragStart: (e) => {
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
    [setDraggingResource, resource, handleDrag, handleDrop]
  );

  const onClick = () => onInsert(resource, width, height);

  if (type === 'image') {
    let imageSrc = src;
    if (sizes) {
      const { web_stories_thumbnail: webStoriesThumbnail, large, full } = sizes;
      if (webStoriesThumbnail && webStoriesThumbnail.source_url) {
        imageSrc = webStoriesThumbnail.source_url;
      } else if (large && large.source_url) {
        imageSrc = large.source_url;
      } else if (full && full.source_url) {
        imageSrc = full.source_url;
      }
    }
    return (
      <Container data-testid="mediaElement" data-id={resourceId}>
        <Image
          key={src}
          src={imageSrc}
          ref={mediaElement}
          width={width}
          height={height}
          alt={alt}
          loading={'lazy'}
          onClick={onClick}
          {...dropTargetsBindings}
        />
        {local && (
          <CSSTransition
            in
            appear={true}
            timeout={0}
            className="uploading-indicator"
          >
            <UploadingIndicator />
          </CSSTransition>
        )}
      </Container>
    );
  }

  const pointerEnter = () => {
    setShowVideoDetail(false);
    if (mediaElement.current) {
      mediaElement.current.play();
    }
  };

  const pointerLeave = () => {
    setShowVideoDetail(true);
    if (mediaElement.current) {
      mediaElement.current.pause();
      mediaElement.current.currentTime = 0;
    }
  };

  const { lengthFormatted, poster, mimeType } = resource;
  return (
    <Container
      onPointerEnter={pointerEnter}
      onPointerLeave={pointerLeave}
      onClick={onClick}
    >
      <Video
        key={src}
        ref={mediaElement}
        poster={poster}
        width={width}
        height={height}
        preload="none"
        muted
        {...dropTargetsBindings}
      >
        <source src={src} type={mimeType} />
      </Video>
      {showVideoDetail && <PlayIcon />}
      {showVideoDetail && <Duration>{lengthFormatted}</Duration>}
      {local && (
        <CSSTransition
          in
          appear={true}
          timeout={0}
          className="uploading-indicator"
        >
          <UploadingIndicator />
        </CSSTransition>
      )}
    </Container>
  );
};

MediaElement.propTypes = {
  resource: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  onInsert: PropTypes.func,
};

export default memo(MediaElement);
