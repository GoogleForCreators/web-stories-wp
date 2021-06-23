/*
 * Copyright 2021 Google LLC
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
import { __ } from '@web-stories-wp/i18n';
import { trackEvent } from '@web-stories-wp/tracking';
import { useCallback } from 'react';
/**
 * Internal dependencies
 */
import { useConfig } from '../../app';
import { useSnackbar } from '../../../design-system';

export default function useImageCrop({
  title = __('Select and Crop', 'web-stories'),
  buttonInsertText = __('Select image', 'web-stories'),
  onSelectErrorMessage = __('Unable to use this file type.', 'web-stories'),
  onSelect = () => {},
  onPermissionError,
  params = {
    flex_width: false,
    flex_height: false,
    width: 500,
    height: 500,
  },
  multiple = false,
}) {
  const {
    allowedImageMimeTypes: type,
    capabilities: { hasUploadMediaAction },
  } = useConfig();

  const { showSnackbar } = useSnackbar();

  const imgSelectOptions = useCallback((attachment, controller) => {
    const control = controller.get('control');

    const flexWidth = Boolean(control.params.flex_width);
    const flexHeight = Boolean(control.params.flex_height);

    const realWidth = attachment.get('width');
    const realHeight = attachment.get('height');

    let xInit = control.params.width;
    let yInit = control.params.height;

    const ratio = xInit / yInit;

    controller.set(
      'canSkipCrop',
      !control.mustBeCropped(
        flexWidth,
        flexHeight,
        xInit,
        yInit,
        realWidth,
        realHeight
      )
    );

    const xImg = xInit;
    const yImg = yInit;

    if (realWidth / realHeight > ratio) {
      yInit = realHeight;
      xInit = yInit * ratio;
    } else {
      xInit = realWidth;
      yInit = xInit / ratio;
    }

    const x1 = (realWidth - xInit) / 2;
    const y1 = (realHeight - yInit) / 2;

    return {
      handles: true,
      keys: true,
      instance: true,
      persistent: true,
      imageWidth: realWidth,
      imageHeight: realHeight,
      minWidth: xImg > xInit ? xInit : xImg,
      minHeight: yImg > yInit ? yInit : yImg,
      x1: x1,
      y1: y1,
      x2: xInit + x1,
      y2: yInit + y1,
    };
  }, []);

  const mustBeCropped = useCallback((flexW, flexH, dstW, dstH, imgW, imgH) => {
    if (true === flexW && true === flexH) {
      return false;
    }

    if (true === flexW && dstH === imgH) {
      return false;
    }

    if (true === flexH && dstW === imgW) {
      return false;
    }

    if (dstW === imgW && dstH === imgH) {
      return false;
    }

    if (imgW <= dstW) {
      return false;
    }

    return true;
  }, []);

  const openCropper = useCallback(
    (evt) => {
      trackEvent('open_crop_modal');
      // If a user does not have the rights to upload to the media library, do not show the media picker.
      if (!hasUploadMediaAction) {
        if (onPermissionError) {
          onPermissionError();
        }
        evt.preventDefault();
        return;
      }

      const control = {
        id: 'control-id',
        params,
        mustBeCropped,
      };

      // Create the media frame.
      const fileFrame = global.wp.media({
        button: {
          text: buttonInsertText,
          close: false,
        },
        states: [
          new wp.media.controller.Library({
            title,
            library: wp.media.query({ type }),
            multiple,
            date: false,
            priority: 20,
            suggestedWidth: params.width,
            suggestedHeight: params.height,
          }),
          new wp.media.controller.CustomizeImageCropper({
            imgSelectOptions,
            control,
          }),
        ],
      });

      fileFrame.on('cropped', onSelect);

      fileFrame.on('skippedcrop', onSelect);

      fileFrame.on('select', () => {
        const attachment = fileFrame.state().get('selection').first().toJSON();

        // Only allow user to select a mime type from allowed list.
        if (Array.isArray(type) && !type.includes(attachment.mime)) {
          fileFrame.close();
          showSnackbar({ message: onSelectErrorMessage });

          return;
        }

        if (
          control.params.width === attachment.width &&
          control.params.height === attachment.height &&
          !control.params.flex_width &&
          !control.params.flex_height
        ) {
          onSelect(attachment);
          fileFrame.close();
        } else {
          fileFrame.setState('cropper');
        }
      });

      // Finally, open the modal
      fileFrame.open();

      evt.preventDefault();
    },
    [
      buttonInsertText,
      hasUploadMediaAction,
      imgSelectOptions,
      multiple,
      mustBeCropped,
      onPermissionError,
      onSelect,
      onSelectErrorMessage,
      params,
      showSnackbar,
      title,
      type,
    ]
  );

  return openCropper;
}
