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

export const styledTiles = css`
  width: 100%;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const Image = styled.img`
  ${styledTiles}
`;

const Video = styled.video`
  ${styledTiles}
`;

function useGetMediaElement({
  insertMediaElement,
  allowedImageMimeTypes,
  allowedVideoMimeTypes,
}) {
  /**
   * Get a formatted element for different media types.
   *
   * @param {Object} mediaEl Attachment object
   * @param {number} width      Width that element is inserted into editor.
   * @return {null|*}          Element or null if does not map to video/image.
   */
  const getMediaElement = (mediaEl, width) => {
    const { src, oWidth, oHeight, mimeType } = mediaEl;
    const origRatio = oWidth / oHeight;
    const height = width / origRatio;
    if (allowedImageMimeTypes.includes(mimeType)) {
      return (
        <Image
          key={src}
          src={src}
          width={width}
          height={height}
          loading={'lazy'}
          onClick={() => insertMediaElement(mediaEl, width)}
        />
      );
    } else if (allowedVideoMimeTypes.includes(mimeType)) {
      return (
        <Video
          key={src}
          width={width}
          height={height}
          onClick={() => insertMediaElement(mediaEl, width)}
          onMouseEnter={(evt) => {
            evt.target.play();
          }}
          onMouseLeave={(evt) => {
            evt.target.pause();
            evt.target.currentTime = 0;
          }}
        >
          <source src={src} type={mimeType} />
        </Video>
      );
    }
    return null;
  };

  return getMediaElement;
}

export default useGetMediaElement;
