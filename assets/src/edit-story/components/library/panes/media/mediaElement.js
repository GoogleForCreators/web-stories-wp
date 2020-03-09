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

const styledTiles = css`
  width: 100%;
  border-radius: 10px;
  margin-bottom: 10px;
  object-fit: contain;
`;

const Image = styled.img`
  ${styledTiles}
`;

const Video = styled.video`
  ${styledTiles}
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
  const oRatio =
    resource.width && resource.height ? resource.width / resource.height : 1;
  const width = requestedWidth || requestedHeight / oRatio;
  const height = requestedHeight || width / oRatio;

  if (resource.type === 'image') {
    return (
      <Image
        key={resource.src}
        src={resource.src}
        width={width}
        height={height}
        loading={'lazy'}
        onClick={() => onInsert(resource, width, height)}
      />
    );
  }

  return (
    <Video
      key={resource.src}
      width={width}
      height={height}
      onClick={() => onInsert(resource, width, height)}
      onPointerEnter={(evt) => {
        evt.target.play();
      }}
      onPointerLeave={(evt) => {
        evt.target.pause();
        evt.target.currentTime = 0;
      }}
    >
      <source src={resource.src} type={resource.mimeType} />
    </Video>
  );
};

MediaElement.propTypes = {
  resource: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  onInsert: PropTypes.func,
};

export default MediaElement;
