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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useCallback, useState } from 'react';

/**
 * Internal dependencies
 */
import { useUploader } from '../../app/uploader';
import { useMedia } from '../../app/media';
import Context from './context';
import getDragType from './utils/getDragType';

const DropZoneWrapper = styled.div`
  height: 100%;
`;

function DropZoneProvider({ children }) {
  const [dropZones, setDropZones] = useState([]);
  const [hoveredDropZone, setHoveredDropZone] = useState(null);
  const { uploadFile } = useUploader();
  const {
    state: { DEFAULT_WIDTH },
    actions: { insertMediaElement },
  } = useMedia();

  const registerDropZone = useCallback(
    (dropZone) => {
      // If dropZone isn't registered yet.
      if (dropZone && !dropZones.some(({ node }) => node === dropZone.node)) {
        setDropZones((oldDropZones) => [...oldDropZones, dropZone]);
      }
    },
    [dropZones]
  );

  // Unregisters dropzones which node's don't exist.
  const unregisterDropZone = useCallback(
    (dropZone) => {
      // If dropZone needs unregistering.
      if (dropZones.some((dz) => dz === dropZone)) {
        setDropZones((oldDropZones) =>
          oldDropZones.filter((dz) => dz !== dropZone)
        );
      }
    },
    [dropZones]
  );

  const isWithinElementBounds = (element, x, y) => {
    const rect = element.getBoundingClientRect();
    if (rect.bottom === rect.top || rect.left === rect.right) {
      return false;
    }
    return (
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    );
  };

  const resetHoverState = () => {
    setHoveredDropZone(null);
  };

  const onDragOver = (evt) => {
    disableDefaults(evt);
    // Get the hovered dropzone. // @todo Consider dropzone inside dropzone, will we need this?
    const foundDropZones = dropZones.filter((dropZone) => {
      return isWithinElementBounds(dropZone.node, evt.clientX, evt.clientY);
    });

    // If there was a dropzone before and nothing was found now, reset.
    if (hoveredDropZone && !foundDropZones.length) {
      resetHoverState();
      return;
    }

    const foundDropZone = foundDropZones[0];

    // If dropzone not found, do nothing.
    if (!foundDropZone || !foundDropZone.node) {
      return;
    }
    const rect = foundDropZone.node.getBoundingClientRect();

    const position = {
      x: evt.clientX - rect.left < rect.right - evt.clientX ? 'left' : 'right',
      y: evt.clientY - rect.top < rect.bottom - evt.clientY ? 'top' : 'bottom',
    };

    if (
      !hoveredDropZone ||
      hoveredDropZone.node !== foundDropZone.node ||
      position.x !== hoveredDropZone.position.x ||
      position.y !== hoveredDropZone.position.y
    ) {
      setHoveredDropZone({
        node: foundDropZone.node,
        position,
      });
    }
  };

  const disableDefaults = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
  };

  const onDrop = (evt) => {
    disableDefaults(evt);
    if ('file' === getDragType(evt)) {
      const files = [...evt.dataTransfer.files];
      files.forEach((file) => {
        uploadFile(file).then(
          ({
            id,
            guid: { rendered: src },
            media_details: { width: oWidth, height: oHeight },
            mime_type: mimeType,
            featured_media: posterId,
            featured_media_src: poster,
          }) => {
            const mediaEl = {
              id,
              posterId,
              poster,
              src,
              oWidth,
              oHeight,
              mimeType,
            };
            insertMediaElement(mediaEl, DEFAULT_WIDTH, false);
          }
        );
      });
    }
  };

  const state = {
    state: {
      hoveredDropZone,
      dropZones,
    },
    actions: {
      registerDropZone,
      unregisterDropZone,
      resetHoverState,
    },
  };
  return (
    <DropZoneWrapper
      onDragOver={onDragOver}
      onDragLeave={disableDefaults}
      onDragEnter={disableDefaults}
      onDrop={onDrop}
    >
      <Context.Provider value={state}>{children}</Context.Provider>
    </DropZoneWrapper>
  );
}

DropZoneProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default DropZoneProvider;
