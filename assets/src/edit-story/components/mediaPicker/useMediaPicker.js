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
import { useEffect } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useConfig } from '../../app/config';
import { useSnackbar } from '../../app/snackbar';
import { useAPI } from '../../app/api';
import { trackEvent } from '../../../tracking';

export default function useMediaPicker({
  title = __('Upload to Story', 'web-stories'),
  buttonInsertText = __('Insert into page', 'web-stories'),
  onSelect = () => {},
  onClose = () => {},
  type = '',
  multiple = false,
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
      wp.media.controller.Library.prototype.defaults.contentUserSetting = false;
    } catch (e) {
      // Silence.
    }
  });
  useEffect(() => {
    try {
      // Handles the video processing logic from WordPress.
      // The Uploader.success callback is invoked when a user uploads a file.
      // Race condition concern: please DO NOT upload video poster on this
      // callback, becuase the video is not guarantee to be ready at the moment.
      // We should only upload the video poster on the select event.
      wp.Uploader.prototype.success = ({ attributes }) => {
        updateMedia(attributes.id, { media_source: 'editor' });
      };
    } catch (e) {
      // Silence.
    }
  }, [updateMedia]);

  const openMediaPicker = (evt) => {
    trackEvent('open_media_modal', 'editor');

    // If a user does not have the rights to upload to the media library, do not show the media picker.
    if (!hasUploadMediaAction) {
      const message = __(
        'Sorry, you are unable to upload files.',
        'web-stories'
      );
      showSnackbar({ message });
      evt.preventDefault();
      return false;
    }

    // Create the media frame.
    const fileFrame = wp.media({
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
    // The onSelect logic is defined in mediaPane.js/onSelect, which handles the
    // logic when user click on the button `Insert into page`.
    fileFrame.on('select', () => {
      const mediaPickerEl = fileFrame.state().get('selection').first().toJSON();
      onSelect(mediaPickerEl);
    });

    if (onClose) {
      fileFrame.on('close', onClose);
    }

    // Finally, open the modal
    fileFrame.open();

    evt.preventDefault();

    // Might be useful to return the media frame here.
    return fileFrame;
  };

  return openMediaPicker;
}
