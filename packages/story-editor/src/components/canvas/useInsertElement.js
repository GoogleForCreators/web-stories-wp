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
import STICKERS from '@googleforcreators/stickers';
import { dataPixels } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import { createNewElement, getDefinitionForType } from '../../elements';
import { useLocalMedia } from '../../app/media';
import { useStory } from '../../app/story';
import { useLayout } from '../../app/layout';
import { DEFAULT_MASK } from '../../masks/constants';
import { ZOOM_SETTING } from '../../constants';
import useMedia3pApi from '../../app/media/media3p/api/useMedia3pApi';
import getInsertedElementSize from '../../utils/getInsertedElementSize';
import { getMediaBaseColor } from '../../utils/getMediaBaseColor';
import useCORSProxy from '../../utils/useCORSProxy';
import useFocusCanvas from './useFocusCanvas';

function useInsertElement() {
  const { addElement, updateElementById } = useStory((state) => ({
    addElement: state.actions.addElement,
    updateElementById: state.actions.updateElementById,
  }));
  const { postProcessingResource } = useLocalMedia((state) => ({
    postProcessingResource: state.actions.postProcessingResource,
  }));
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
        local,
        baseColor: currentBaseColor,
        src,
        poster,
        type,
      } = resource;

      const imageSrc = type === 'image' ? src : poster;
      if (local || !imageSrc || currentBaseColor || !isExternal) {
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
    [getProxiedUrl, checkResourceAccess, updateElementById]
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
      setZoomSetting(ZOOM_SETTING.FIT);
      const element = createElementForCanvas(type, props);
      const { id, resource } = element;
      addElement({ element });
      if (resource) {
        postProcessingResource(resource);
        handleRegisterUsage(resource);
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
      handleRegisterUsage,
      setZoomSetting,
    ]
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
    sticker,
    ...rest
  }
) {
  const { isMaskable } = getDefinitionForType(type);

  const attrs = { type, ...rest };

  const stickerRatio = sticker && STICKERS?.[sticker?.type]?.aspectRatio;

  // Width and height defaults. Width takes precedence.
  const ratio =
    resource && isNum(resource.width) && isNum(resource.height)
      ? resource.width / resource.height
      : 1;
  const size = getInsertedElementSize(
    type,
    width,
    height,
    attrs,
    stickerRatio || ratio,
    resource
  );
  width = size.width;
  height = size.height;

  // X and y defaults: in the top corner of the page.
  if (!isNum(x)) {
    x = 48;
  }
  if (!isNum(y)) {
    y = 0;
  }

  x = dataPixels(x);
  y = dataPixels(y);

  return {
    ...attrs,
    resource,
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
    ...(sticker ? { sticker } : {}),
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
