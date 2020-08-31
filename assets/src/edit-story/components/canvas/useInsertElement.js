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
import { useLocalMedia, useStory } from '../../app';
import { DEFAULT_MASK } from '../../masks';
import useMedia3pApi from '../../app/media/media3p/api/useMedia3pApi';
import useFocusCanvas from './useFocusCanvas';

const RESIZE_WIDTH_DIRECTION = [1, 0];

function useInsertElement() {
  const { addElement } = useStory((state) => ({
    addElement: state.actions.addElement,
  }));
  const { uploadVideoPoster } = useLocalMedia((state) => ({
    uploadVideoPoster: state.actions.uploadVideoPoster,
  }));
  const {
    actions: { registerUsage },
  } = useMedia3pApi();

  /**
   * @param {Object} resource The resource to verify/update.
   * @param {string} elementId The element's id to be updated once resource
   * is complete.
   */
  const backfillResource = useCallback(
    (resource) => {
      const { type, src, id, posterId } = resource;

      // Generate video poster if one not set.
      if (type === 'video' && id && !posterId) {
        uploadVideoPoster(id, src);
      }
    },
    [uploadVideoPoster]
  );

  /**
   * If the resource has a register usage url then the fact that it's been
   * inserted needs to be registered as per API provider policies.
   *
   * @param {Object} resource The resource to attempt to register usage.
   */
  const handleRegisterUsage = useCallback(
    (resource) => {
      if (!resource.local && resource?.attribution?.registerUsageUrl) {
        registerUsage({
          registerUsageUrl: resource.attribution.registerUsageUrl,
        });
      }
    },
    [registerUsage]
  );

  const focusCanvas = useFocusCanvas();

  /**
   * @param {string} type The element's type.
   * @param {Object} props The element's initial properties.
   */
  const insertElement = useCallback(
    (type, props) => {
      if (type == 'gif') {
        // Treat GIFs just like images
        type = 'image';
        props.resource.type = 'image';
      }

      const element = createElementForCanvas(type, props);
      const { id, resource } = element;
      addElement({ element });
      if (resource) {
        backfillResource(resource);
        handleRegisterUsage(resource);
      }
      // Auto-play on insert.
      if (type === 'video') {
        setTimeout(() => {
          const videoEl = document.getElementById(`video-${id}`);
          if (videoEl) {
            videoEl.play().catch(() => {});
          }
        });
      }
      focusCanvas();
      return element;
    },
    [addElement, backfillResource, focusCanvas, handleRegisterUsage]
  );

  return insertElement;
}

/**
 * @param {string} type Element type.
 * @param {!Object} props The element's properties.
 * @param {number} props.width The element's width.
 * @param {number} props.height The element's height.
 * @param {?Object} props.mask The element's mask.
 * @return {Object} The element properties.
 */
function getElementProperties(
  type,
  {
    resource,
    x,
    y,
    width,
    height,
    mask,
    rotationAngle = 0,
    scale = 100,
    focalX = 50,
    focalY = 50,
    ...rest
  }
) {
  const {
    defaultAttributes,
    isMaskable,
    updateForResizeEvent,
  } = getDefinitionForType(type);

  const attrs = { type, ...defaultAttributes, ...rest };

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
      // to fit on the page (80% max).
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

  return {
    ...attrs,
    ...(Boolean(resource) && {
      resource: {
        ...resource,
        width,
        height,
        alt: resource.alt || '',
      },
    }),
    x,
    y,
    width,
    height,
    rotationAngle,
    scale,
    focalX,
    focalY,
    ...(isMaskable
      ? {
          mask: mask || DEFAULT_MASK,
        }
      : {}),
  };
}

/**
 * @param {string} type Element type.
 * @param {!Object} props The element's properties.
 * @return {Object} The new element.
 */
function createElementForCanvas(type, props) {
  return createNewElement(type, getElementProperties(type, props));
}

/**
 * @param {?number|undefined} value The value.
 * @return {boolean} Whether the value has been set.
 */
function isNum(value) {
  return typeof value === 'number';
}

export default useInsertElement;
export { getElementProperties };
