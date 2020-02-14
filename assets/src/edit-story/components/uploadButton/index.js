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
import { useEffect } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

function UploadButton({
  title,
  buttonText,
  buttonCSS,
  buttonInsertText,
  multiple,
  onSelect,
  onClose,
  type,
}) {
  useEffect(() => {
    // Work around that forces default tab as upload tab.
    wp.media.controller.Library.prototype.defaults.contentUserSetting = false;
  });

  const mediaPicker = (evt) => {
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
    let attachment;

    // When an image is selected, run a callback.
    fileFrame.on('select', () => {
      attachment = fileFrame
        .state()
        .get('selection')
        .first()
        .toJSON();
      onSelect(attachment);
    });

    if (onClose) {
      fileFrame.on('close', onClose);
    }

    // Finally, open the modal
    fileFrame.open();

    evt.preventDefault();
  };

  const Button = styled.button`
    ${buttonCSS}
  `;

  return <Button onClick={mediaPicker}>{buttonText}</Button>;
}

UploadButton.propTypes = {
  title: PropTypes.string,
  buttonInsertText: PropTypes.string,
  multiple: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  type: PropTypes.string,
  buttonCSS: PropTypes.array,
  buttonText: PropTypes.string.isRequired,
};

UploadButton.defaultProps = {
  title: __('Upload to Story', 'web-stories'),
  buttonText: __('Upload', 'web-stories'),
  buttonInsertText: __('Insert into page', 'web-stories'),
  multiple: false,
  type: '',
};

export default UploadButton;
