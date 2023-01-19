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
import Gallery from 'react-photo-album';

/**
 * Internal dependencies
 */
import { SIDEBAR_WIDTH } from '../../../../../constants';
import MediaElement from './mediaElement';
import { GalleryContainer } from './styles';

const PHOTO_SPACING = 8;
const TARGET_ROW_HEIGHT = 110;
const ROW_CONSTRAINTS = { maxPhotos: 2 };

// eslint-disable-next-line react/prop-types -- Negligible here.
const ContainerRenderer = ({ children, containerRef }) => {
  return <GalleryContainer ref={containerRef}>{children}</GalleryContainer>;
};

const RowRenderer = ({ children }) => children;

/**
 * @callback InsertionCallback
 * @param {Object} element Inserted element.
 */

/**
 * Displays a gallery of media elements arranged in a row-based format.
 *
 * @param {Object} props Component props.
 * @param {Array.<Object>} props.resources List of resources to display.
 * @param {Array.<Object>} props.uploadingResources List of uploading resources to display.
 * @param {InsertionCallback} props.onInsert Called when element is selected.
 * @param {string} props.providerType Provider of gallery's elements.
 * @param {boolean} props.canEditMedia Current user can upload media.
 * @return {*} The gallery element.
 */
function MediaGallery({
  resources,
  uploadingResources = [],
  onInsert,
  providerType,
  canEditMedia = false,
}) {
  // Use different key for uploading vs. uploaded items to avoid confusions.
  const photos = [
    ...uploadingResources.map((resource) => ({
      key: `uploading-${resource.id}`,
      src: resource.src,
      width: resource.width,
      height: resource.height,
      resource,
    })),
    ...resources.map((resource) => ({
      key: resource.id,
      src: resource.src,
      width: resource.width,
      height: resource.height,
      resource,
    })),
  ].map((photo, index) => ({
    ...photo,
    index,
  }));

  const imageRenderer = useCallback(
    ({ photo, layout }) => {
      return (
        <MediaElement
          key={photo.key}
          index={photo.index}
          margin={`0px 0px ${PHOTO_SPACING}px 0px`}
          resource={photo.resource}
          width={layout.width}
          height={layout.height}
          onInsert={onInsert}
          providerType={providerType}
          canEditMedia={canEditMedia}
        />
      );
    },
    [providerType, onInsert, canEditMedia]
  );

  return (
    <div>
      <Gallery
        layout="rows"
        photos={photos}
        renderPhoto={imageRenderer}
        renderRowContainer={RowRenderer}
        renderContainer={ContainerRenderer}
        targetRowHeight={TARGET_ROW_HEIGHT}
        rowConstraints={ROW_CONSTRAINTS}
        spacing={PHOTO_SPACING}
        // Used for tests / SSR.
        defaultContainerWidth={SIDEBAR_WIDTH}
      />
    </div>
  );
}

MediaGallery.propTypes = {
  resources: PropTypes.arrayOf(PropTypes.object).isRequired,
  uploadingResources: PropTypes.arrayOf(PropTypes.object),
  onInsert: PropTypes.func.isRequired,
  providerType: PropTypes.string.isRequired,
  canEditMedia: PropTypes.bool,
};
export default MediaGallery;
