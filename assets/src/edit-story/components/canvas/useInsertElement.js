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
import { useCallback } from 'react';

/**
 * Internal dependencies
 */
import {
  DEFAULT_EDITOR_PAGE_WIDTH,
  DEFAULT_EDITOR_PAGE_HEIGHT,
} from '../../constants';
import { createNewElement, getDefinitionForType } from '../../elements';
import { editorToDataX, editorToDataY } from '../../units';
import { useMedia, useStory } from '../../app';
import { DEFAULT_MASK } from '../../masks';

function useInsertElement() {
  const {
    actions: { addElement, setBackgroundElement },
    state: { currentPage },
  } = useStory();
  const {
    actions: { uploadVideoFrame },
  } = useMedia();

  /**
   * @param {Object} resource The resource to verify/update.
   * @param {string} elementId The element's id to be updated once resource
   * is complete.
   */
  const backfillResource = useCallback(
    (resource, elementId) => {
      const { type, src, videoId, posterId } = resource;

      // Generate video poster if one not set.
      if (type === 'video' && videoId && !posterId) {
        uploadVideoFrame(videoId, src, elementId);
      }
    },
    [uploadVideoFrame]
  );

  /**
   * @param {string} type The element's type.
   * @param {Object} props The element's initial properties.
   */
  const insertElement = useCallback(
    (type, props) => {
      const element = createElement(type, props);
      const { id: elementId, resource } = element;
      addElement({ element });
      if (
        isMedia(type) &&
        !currentPage.elements.some(({ type: elType }) => isMedia(elType))
      ) {
        setBackgroundElement({ elementId });
      }
      if (resource) {
        backfillResource(resource, elementId);
      }
      return element;
    },
    [addElement, setBackgroundElement, currentPage, backfillResource]
  );

  return insertElement;
}

/**
 * @param {string} type Element type.
 * @param {!Object} props The element's properties.
 * @param {number} props.width The element's width.
 * @param {number} props.height The element's height.
 * @param {?Object} props.mask The element's mask.
 * @return {!Object} The new element.
 */
function createElement(type, { width, height, mask, ...rest }) {
  const { isMaskable } = getDefinitionForType(type);
  const element = createNewElement(type, {
    ...rest,
    x: editorToDataX(80 * Math.random(), DEFAULT_EDITOR_PAGE_WIDTH),
    y: editorToDataY(70 * Math.random(), DEFAULT_EDITOR_PAGE_HEIGHT),
    width: editorToDataX(width, DEFAULT_EDITOR_PAGE_WIDTH),
    height: editorToDataY(height, DEFAULT_EDITOR_PAGE_HEIGHT),
    ...(isMaskable
      ? {
          mask: mask || DEFAULT_MASK,
        }
      : {}),
  });
  return element;
}

/**
 * @param {string} type The resource type.
 * @return {boolean} Whether this is a media element.
 */
function isMedia(type) {
  const { isMedia: media } = getDefinitionForType(type);
  return media;
}

export default useInsertElement;
