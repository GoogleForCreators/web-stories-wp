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
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { UploadDropTarget, UploadDropTargetMessage } from '../uploadDropTarget';
import { useMedia } from '../../app/media';

const MESSAGE_ID = 'edit-story-library-upload-message';
const message = __('Upload to media library', 'web-stories');

function LibraryUploadDropTarget({ children }) {
  // TODO: Find out why [uploadMedia] causes unnecessary re-renders.
  // const {
  //   actions: { uploadMedia },
  // } = useMedia();
  // const onDropHandler = useCallback(
  //   (files) => {
  //     uploadMedia(files);
  //   },
  //   [uploadMedia]
  // );
  return (
    <UploadDropTarget onDrop={null} labelledBy={MESSAGE_ID}>
      {children}
      <UploadDropTargetMessage
        id={MESSAGE_ID}
        message={message}
      />
    </UploadDropTarget>
  );
}

LibraryUploadDropTarget.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LibraryUploadDropTarget;
