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
import { useCallback, useEffect, useMemo } from 'react';
import { __ } from '@web-stories-wp/i18n';
import { trackEvent } from '@web-stories-wp/tracking';
import { useSnackbar } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { useConfig } from '../../app/config';
import { useAPI } from '../../app/api';
import { calculateImageSelectOptions, mustBeCropped } from './utils';

/**
 * Custom hook to open the WordPress media modal.
 *
 * @param {Object} props Props.
 * @param {string} [props.title] Media modal title.
 * @param {string} [props.buttonInsertText] Text to use for the "Insert" button.
 * @param {Function} props.onSelect Selection callback. Used to process the inserted image.
 * @param {string} props.onSelectErrorMessage Text displayed when incorrect file type is selected.
 * @param {Function?} props.onClose Close Callback.
 * @param {Function?} props.onPermissionError Callback for when user does not have upload permissions.
 * @param {string|string[]} props.type Media type(s).
 * @param {boolean} props.multiple Whether multi-selection should be allowed.
 * @param {Object} props.params Object params for cropped images.
 * @return {Function} Callback to open the media picker.
 */
export default function useMediaPicker({
  title = __('Upload to Story', 'web-stories'),
  buttonInsertText = __('Insert into page', 'web-stories'),
  onSelect,
  onSelectErrorMessage = __('Unable to use this file type.', 'web-stories'),
  onClose,
  onPermissionError,
  type = '',
  multiple = false,
  params,
}) {
  const {
    actions: { updateMedia },
  } = useAPI();
  const {
    capabilities: { hasUploadMediaAction },
  } = useConfig();
  const { showSnackbar } = useSnackbar();
  useEffect(() => {
    try {
      // Work around that forces default tab as upload tab.
      global.wp.media.controller.Library.prototype.defaults.contentUserSetting = false;
    } catch (e) {
      // Silence.
    }
  });
  useEffect(() => {
    try {
      // Handles the video processing logic from WordPress.
      // The Uploader.success callback is invoked when a user uploads a file.
      // Race condition concern: the video content is not guaranteed to be
      // available in this callback. For the video poster insertion, please check: assets/src/edit-story/components/library/panes/media/local/mediaPane.js
      wp.Uploader.prototype.success = ({ attributes }) => {
        updateMedia(attributes.id, { media_source: 'editor' });
      };
    } catch (e) {
      // Silence.
    }
  }, [updateMedia]);

  const openMediaDialog = useCallback(
    (evt) => {
      trackEvent('open_media_modal');

      // If a user does not have the rights to upload to the media library, do not show the media picker.
      if (!hasUploadMediaAction) {
        if (onPermissionError) {
          onPermissionError();
        }
        evt.preventDefault();
        return;
      }

      // Create the media frame.
      const fileFrame = global.wp.media({
        title,
        library: {
          type,
        },
        button: {
          text: buttonInsertText,
        },
        multiple,
      });

      // When an image is selected, run a callback.
      fileFrame.once('select', () => {
        const mediaPickerEl = fileFrame
          .state()
          .get('selection')
          .first()
          .toJSON();

        // Only allow user to select a mime type from allowed list.
        if (Array.isArray(type) && !type.includes(mediaPickerEl.mime)) {
          showSnackbar({ message: onSelectErrorMessage });

          return;
        }
        onSelect(mediaPickerEl);
      });

      if (onClose) {
        fileFrame.once('close', onClose);
      }

      fileFrame.once('content:activate:browse', () => {
        // Force-refresh media modal contents every time
        // to avoid stale data.
        fileFrame.content?.get()?.collection?._requery(true);
        fileFrame.content?.get()?.options?.selection?.reset();
      });

      // Finally, open the modal
      fileFrame.open();

      evt.preventDefault();
    },
    [
      hasUploadMediaAction,
      showSnackbar,
      onPermissionError,
      onClose,
      onSelect,
      buttonInsertText,
      onSelectErrorMessage,
      multiple,
      type,
      title,
    ]
  );

  const openCropper = useCallback(
    (evt) => {
      trackEvent('open_media_crop_modal');
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

      const button = {
        text: buttonInsertText,
        close: false,
      };

      // Create the media frame.
      const fileFrame = global.wp.media({
        button,
        states: [
          new wp.media.controller.Library({
            title,
            library: wp.media.query({ type }),
            button,
            multiple,
            suggestedWidth: params.width,
            suggestedHeight: params.height,
          }),
          new wp.media.controller.CustomizeImageCropper({
            imgSelectOptions: calculateImageSelectOptions,
            control,
          }),
        ],
      });

      fileFrame.on('cropped', (attachment) => {
        updateMedia(attachment.id, { media_source: 'editor' });
        onSelect(attachment);
      });

      fileFrame.on('skippedcrop', onSelect);

      fileFrame.on('select', () => {
        const mediaPickerEl = fileFrame
          .state()
          .get('selection')
          .first()
          .toJSON();

        // Only allow user to select a mime type from allowed list.
        if (Array.isArray(type) && !type.includes(mediaPickerEl.mime)) {
          fileFrame.close();
          showSnackbar({ message: onSelectErrorMessage });

          return;
        }

        if (onClose) {
          fileFrame.once('close', onClose);
        }

        if (
          control.params.width === mediaPickerEl.width &&
          control.params.height === mediaPickerEl.height &&
          !control.params.flex_width &&
          !control.params.flex_height
        ) {
          onSelect(mediaPickerEl);
          fileFrame.close();
        } else {
          fileFrame.setState('cropper');
        }
      });

      fileFrame.once('content:activate:browse', () => {
        // Force-refresh media modal contents every time
        // to avoid stale data.
        fileFrame.content?.get()?.collection?._requery(true);
        fileFrame.content?.get()?.options?.selection?.reset();
      });

      // Finally, open the modal
      fileFrame.open();

      evt.preventDefault();
    },
    [
      hasUploadMediaAction,
      params,
      buttonInsertText,
      title,
      type,
      multiple,
      onSelect,
      onClose,
      onPermissionError,
      updateMedia,
      showSnackbar,
      onSelectErrorMessage,
    ]
  );

  return useMemo(() => {
    return params ? openCropper : openMediaDialog;
  }, [params, openCropper, openMediaDialog]);
}
