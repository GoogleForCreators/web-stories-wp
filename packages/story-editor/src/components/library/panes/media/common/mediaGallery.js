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
import { useCallback } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import PhotoAlbum from 'react-photo-album';

/**
 * Internal dependencies
 */
import MediaElement from './mediaElement';

const PHOTO_MARGIN = 4;

/**
 * @callback InsertionCallback
 * @param {Object} element Inserted element.
 */

/**
 * Displays a gallery of media elements arranged in a row-based format.
 *
 * @param {Object} props Component props.
 * @param {Array.<Object>} props.resources List of resources to display.
 * @param {InsertionCallback} props.onInsert Called when element is selected.
 * @param {string} props.providerType Provider of gallery's elements.
 * @param {boolean} props.canEditMedia Current user can upload media.
 * @return {*} The gallery element.
 */
function MediaGallery({ resources, onInsert, providerType, canEditMedia }) {
  const photos = resources.map((resource, index) => ({
    index,
    key: resource.id,
    src: resource.src,
    width: resource.width,
    height: resource.height,
  }));

  const imageRenderer = useCallback(
    ({ photo, layout }) => {
      return (
        <MediaElement
          key={photo.key}
          index={photo.index}
          margin={PHOTO_MARGIN + 'px'}
          resource={resources[photo.index]}
          width={layout.width}
          height={layout.height}
          onInsert={onInsert}
          providerType={providerType}
          canEditMedia={canEditMedia}
        />
      );
    },
    [providerType, onInsert, resources, canEditMedia]
  );

  return (
    <div>
      <PhotoAlbum
        layout="rows"
        photos={photos}
        renderPhoto={imageRenderer}
        targetRowHeight={110}
        // This should match the actual margin the element is styled with.
        spacing={PHOTO_MARGIN}
      />
    </div>
  );
}

MediaGallery.propTypes = {
  resources: PropTypes.arrayOf(PropTypes.object).isRequired,
  onInsert: PropTypes.func.isRequired,
  providerType: PropTypes.string.isRequired,
  canEditMedia: PropTypes.bool,
};

MediaGallery.defaultProps = {
  canEditMedia: false,
};

export default MediaGallery;
