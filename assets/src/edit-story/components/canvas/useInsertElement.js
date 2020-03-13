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
import { DEFAULT_DPR, PAGE_WIDTH, PAGE_HEIGHT } from '../../constants';
import { createNewElement, getDefinitionForType } from '../../elements';
import { dataPixels } from '../../units';
import { useMedia, useStory } from '../../app';
import { DEFAULT_MASK } from '../../masks';

const RESIZE_WIDTH_DIRECTION = [1, 0];

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
      const element = createElementForCanvas(type, props);
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
function createElementForCanvas(
  type,
  { resource, x, y, width, height, rotationAngle, mask, ...rest }
) {
  const {
    defaultAttributes,
    isMaskable,
    updateForResizeEvent,
  } = getDefinitionForType(type);

  const attrs = { ...defaultAttributes, ...rest };

  // Width and height defaults. Width takes precedence.
  const ratio =
    resource && isNum(resource.width) && isNum(resource.height)
      ? resource.width / resource.height
      : 1;
  if (!isNum(width)) {
    if (isNum(height)) {
      // Height is known: use aspect ratio.
      width = height * ratio;
    } else if (resource) {
      // Resource is available: take resource's width with DPR, but limit
      // to fit on the page.
      width = Math.min(resource.width * DEFAULT_DPR, PAGE_WIDTH * 0.8);
    } else {
      // Default to half of page.
      width = PAGE_WIDTH / 2;
    }
  }
  if (!isNum(height) && updateForResizeEvent) {
    // Try resize API with width-only direction.
    height = updateForResizeEvent(attrs, RESIZE_WIDTH_DIRECTION, width).height;
  }
  if (!isNum(height)) {
    // Fallback to simple ratio calculation.
    height = width / ratio;
  }

  // Ensure that the element fits on the page.
  if (width > PAGE_WIDTH || height > PAGE_HEIGHT) {
    const pageRatio = PAGE_WIDTH / PAGE_HEIGHT;
    const newRatio = width / height;
    if (newRatio <= pageRatio) {
      width = Math.min(width, PAGE_WIDTH);
      height = width / newRatio;
    } else {
      height = Math.min(height, PAGE_HEIGHT);
      width = height * newRatio;
    }
  }
  width = dataPixels(width);
  height = dataPixels(height);

  // X and y defaults: in the top quarter of the page.
  if (!isNum(x)) {
    x = (PAGE_WIDTH / 4) * Math.random();
  }
  if (!isNum(y)) {
    y = (PAGE_HEIGHT / 4) * Math.random();
  }
  x = dataPixels(Math.min(x, PAGE_WIDTH - width));
  y = dataPixels(Math.min(y, PAGE_HEIGHT - height));

  const element = createNewElement(type, {
    ...attrs,
    resource,
    x,
    y,
    width,
    height,
    rotationAngle: rotationAngle || 0,
    ...(isMaskable
      ? {
          mask: mask || DEFAULT_MASK,
        }
      : {}),
  });

  return element;
}

/**
 * @param {?number|undefined} value The value.
 * @return {boolean} Whether the value has been set.
 */
function isNum(value) {
  return typeof value === 'number';
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
export { createElementForCanvas };
