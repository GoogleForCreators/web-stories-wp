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
import styled from 'styled-components';
import { useCallback } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import {
  UploadDropTarget,
  UploadDropTargetScreen,
  UploadDropTargetMessageOverlay,
  UploadDropTargetOverlay,
} from '../uploadDropTarget';
import { useUploader } from '../../app/uploader';
import { getResourceFromUploadAPI } from '../library/panes/media/mediaUtils';
import { Layer as CanvasLayer, PageArea } from './layout';
import useInsertElement from './useInsertElement';

const MESSAGE_ID = 'edit-story-canvas-upload-message';

const PageAreaCover = styled(PageArea)`
  background-color: ${({ theme }) => theme.colors.fg.v1};
  outline: 2px solid ${({ theme }) => theme.colors.selection};
`;

function CanvasUploadDropTarget({ children }) {
  const { uploadFile } = useUploader();
  const insertElement = useInsertElement();
  const onDropHandler = useCallback(
    (files) => {
      files.forEach((file) => {
        uploadFile(file).then((res) => {
          const resource = getResourceFromUploadAPI(res);
          insertElement(resource.type, { resource });
        });
      });
    },
    [insertElement, uploadFile]
  );

  return (
    <UploadDropTarget onDrop={onDropHandler} labelledBy={MESSAGE_ID}>
      {children}
      <UploadCanvasOverlay>
        <PageAreaCover />
      </UploadCanvasOverlay>
      <UploadDropTargetScreen />
      <UploadCanvasOverlay>
        <PageArea>
          <UploadDropTargetMessageOverlay
            id={MESSAGE_ID}
            message={__(
              'Upload to media library and add to the page.',
              'web-stories'
            )}
          />
        </PageArea>
      </UploadCanvasOverlay>
    </UploadDropTarget>
  );
}

CanvasUploadDropTarget.propTypes = {
  children: StoryPropTypes.children.isRequired,
};

function UploadCanvasOverlay({ children }) {
  return (
    <UploadDropTargetOverlay>
      <CanvasLayer>{children}</CanvasLayer>
    </UploadDropTargetOverlay>
  );
}

UploadCanvasOverlay.propTypes = {
  children: StoryPropTypes.children.isRequired,
};

export default CanvasUploadDropTarget;
