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
import PropTypes from 'prop-types';
import { rgba } from 'polished';
import { useState, useRef } from 'react';

/**
 * Internal dependencies
 */
import { useDropTargets } from '../../../../app';
import { ReactComponent as Play } from './play.svg';

const styledTiles = css`
  width: 100%;

  object-fit: contain;
`;

const Image = styled.img`
  ${styledTiles}
  margin-bottom: 10px;
`;

const Video = styled.video`
  ${styledTiles}
`;

const Container = styled.div`
  width: 100%;
  position: relative;
  margin-bottom: 10px;
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
  const { src, type, width: originalWidth, height: originalHeight } = resource;
  const oRatio =
    originalWidth && originalHeight ? originalWidth / originalHeight : 1;
  const width = requestedWidth || requestedHeight / oRatio;
  const height = requestedHeight || width / oRatio;

  const mediaElement = useRef();
  const [showVideoDetail, setShowVideoDetail] = useState(true);

  const {
    actions: { handleDrag, handleDrop, isDropSource },
  } = useDropTargets();

  const dropTargetsBindings = isDropSource(resource.type)
    ? {
        draggable: 'true',
        onDrag: (e) => handleDrag(resource, e.clientX, e.clientY),
        onDragEnd: () => handleDrop(resource),
      }
    : {};

  const onClick = () => onInsert(resource, width, height);

  if (type === 'image') {
    return (
      <Image
        key={src}
        src={src}
        ref={mediaElement}
        width={width}
        height={height}
        loading={'lazy'}
        onClick={onClick}
        {...dropTargetsBindings}
      />
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
        {...dropTargetsBindings}
      >
        <source src={src} type={mimeType} />
      </Video>
      {showVideoDetail && <PlayIcon />}
      {showVideoDetail && <Duration>{lengthFormatted}</Duration>}
    </Container>
  );
};

MediaElement.propTypes = {
  resource: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  onInsert: PropTypes.func,
};

export default MediaElement;
