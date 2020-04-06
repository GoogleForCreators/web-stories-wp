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
import { useMedia } from '../../app/media';

export default function useMediaPicker({
  title = __('Upload to Story', 'web-stories'),
  buttonInsertText = __('Insert into page', 'web-stories'),
  onSelect = () => {},
  onClose = () => {},
  type = '',
  multiple = false,
}) {
  const {
    actions: { uploadVideoPoster },
  } = useMedia();
  useEffect(() => {
    // Work around that forces default tab as upload tab.
    wp.media.controller.Library.prototype.defaults.contentUserSetting = false;
  });
  useEffect(() => {
    try {
      wp.Uploader.prototype.success = ({ attributes }) => {
        if (attributes.type === 'video') {
          uploadVideoPoster(attributes.id, attributes.url);
        }
      };
    } catch (e) {}
  }, [uploadVideoPoster]);

  const openMediaPicker = (evt) => {
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
  };

  return openMediaPicker;
}
