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
import { useCallback } from '@web-stories-wp/react';
import { isBlobURL } from '@web-stories-wp/media';

/**
 * Internal dependencies
 */
import { useLocalMedia } from '../../app/media';
import { createNewElement } from '../../elements';
import { useStory } from '../../app/story';
import { useLayout } from '../../app/layout';
import { ZOOM_SETTING } from '../../constants';
import { getMediaBaseColor } from '../../utils/getMediaBaseColor';
import useCORSProxy from '../../utils/useCORSProxy';
import useFocusCanvas from './useFocusCanvas';
import getElementProperties from './utils/getElementProperties';

/**
 * @param {string} type Element type.
 * @param {!Object} props The element's properties.
 * @return {Object} The new element.
 */
function createElementForCanvas(type, props) {
  return createNewElement(type, getElementProperties(type, props));
}

function useInsertElement() {
  const { addElement, updateElementById } = useStory((state) => ({
    addElement: state.actions.addElement,
    updateElementById: state.actions.updateElementById,
  }));
  const { postProcessingResource, isCurrentResourceUploading } = useLocalMedia(
    ({
      state: { isCurrentResourceUploading },
      actions: { postProcessingResource },
    }) => ({
      postProcessingResource,
      isCurrentResourceUploading,
    })
  );
  const {
    actions: { registerUsage },
  } = useMedia3pApi();
  const { getProxiedUrl, checkResourceAccess } = useCORSProxy();

  const { setZoomSetting } = useLayout(({ actions: { setZoomSetting } }) => ({
    setZoomSetting,
  }));

  const generateBaseColor = useCallback(
    async (element) => {
      const { id, resource } = element;
      const {
        isExternal,
        baseColor: currentBaseColor,
        src,
        poster,
        type,
        id: resourceId,
      } = resource;

      const imageSrc = type === 'image' ? src : poster;
      if (
        isCurrentResourceUploading(resourceId) ||
        !imageSrc ||
        isBlobURL(imageSrc) ||
        currentBaseColor ||
        !isExternal
      ) {
        return;
      }

      try {
        const needsProxy =
          type === 'image'
            ? resource?.needsProxy
            : await checkResourceAccess(imageSrc);
        const imageSrcProxied = getProxiedUrl({ needsProxy }, imageSrc);
        const baseColor = await getMediaBaseColor(imageSrcProxied);
        updateElementById({
          elementId: id,
          properties: {
            resource: {
              ...resource,
              baseColor,
            },
          },
        });
      } catch (error) {
        // Do nothing for now.
      }
    },
    [
      isCurrentResourceUploading,
      checkResourceAccess,
      getProxiedUrl,
      updateElementById,
    ]
  );

  const focusCanvas = useFocusCanvas();

  /**
   * @param {string} type The element's type.
   * @param {Object} props The element's initial properties.
   */
  const insertElement = useCallback(
    (type, props) => {
      setZoomSetting(ZOOM_SETTING.FIT);
      const element = createElementForCanvas(type, props);
      const { id, resource } = element;
      addElement({ element });
      if (resource) {
        postProcessingResource(resource);
        generateBaseColor(element);
      }
      // Auto-play on insert.
      if (type === 'video' && resource?.src && !resource.isPlaceholder) {
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
    [
      addElement,
      postProcessingResource,
      generateBaseColor,
      focusCanvas,
      setZoomSetting,
    ]
  );

  return insertElement;
}

export default useInsertElement;
