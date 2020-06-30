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
import React, { useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import Gallery from 'react-photo-gallery';
import MediaElement from './mediaElement';

const PHOTO_MARGIN = 4;

const PhotoContainer = styled.div`
  width: ${({ photo }) => photo.width}px;
  height: ${({ photo }) => photo.height}px;
  margin: ${PHOTO_MARGIN}px;
`;

/**
 * Displays a gallery of media elements arranged in a row-based format.
 *
 * @param {Object} props Component props.
 * @param {Array.<Object>} props.resources List of resources to display.
 * @param {function(Object)} props.onInsert Function that gets when element is clicked.
 * @param {boolean} props.isMedia3p If this gallery is in the Media 3P pane.
 * @return {*} The gallery element.
 */
function MediaGallery({ resources, onInsert, isMedia3p }) {
  const photos = resources.map((resource) => {
    return {
      src: resource.src,
      width: resource.width,
      height: resource.height,
    };
  });

  const imageRenderer = useCallback(
    ({ index, photo }) => {
      return (
        <PhotoContainer photo={photo} key={index}>
          <MediaElement
            resource={resources[index]}
            width={photo.width}
            height={photo.height}
            onInsert={onInsert}
            isMedia3p={isMedia3p}
          />
        </PhotoContainer>
      );
    },
    [isMedia3p, onInsert, resources]
  );

  return (
    resources &&
    resources.length && (
      <Gallery
        targetRowHeight={110}
        direction={'row'}
        margin={PHOTO_MARGIN} // This should match up with the actual margin that each element is styled with.
        photos={photos}
        renderImage={imageRenderer}
      />
    )
  );
}

MediaGallery.propTypes = {
  resources: PropTypes.arrayOf(PropTypes.object).isRequired,
  onInsert: PropTypes.func.isRequired,
  isMedia3p: PropTypes.bool.isRequired,
};

export default memo(MediaGallery);
