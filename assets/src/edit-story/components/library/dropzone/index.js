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
/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import { useUploader } from '../../../app/uploader';
import { ReactComponent as UploadIcon } from './icons/upload.svg';

const DropzoneComponent = styled.div`
  min-width: 100%;
  min-height: 100%;
`;
const OverContent = styled.div``;

const OverlayWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  top: 56px;
  left: 0;
  z-index: 999;
`;
const Heading = styled.h4`
  color: ${({ theme }) => theme.colors.fg.v1};
  margin: 0;
`;
const Text = styled.p`
  color: ${({ theme }) => theme.colors.fg.v1};
`;
const Icon = styled(UploadIcon)`
  height: 54px;
  width: 54px;
  fill: ${({ theme }) => theme.colors.fg.v1};
`;
const Overlay = styled.div`
  position: absolute;
  top: 45%;
  text-align: center;
  width: 100%;
`;

function Dropzone({ children }) {
  const [isDragging, setIsDragging] = useState(false);
  const { uploadFile } = useUploader();

  const disableDefaults = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
  };

  const onDragEnter = (evt) => {
    disableDefaults(evt);
    setIsDragging(true);
  };

  const onDropHandler = (evt) => {
    disableDefaults(evt);
    const dt = evt.dataTransfer;
    let files = dt.files;
    files = [...files];
    files.forEach(uploadFile);
    setIsDragging(false);
  };

  return (
    <DropzoneComponent
      onDragStart={disableDefaults}
      onDragOver={disableDefaults}
      onDragLeave={disableDefaults}
      onDragEnter={onDragEnter}
      onDrop={onDropHandler}
    >
      {isDragging && (
        <OverlayWrapper>
          <Overlay>
            <Icon />
            <Heading>{__('Upload to media library', 'web-stories')}</Heading>
            <Text>
              {__(
                'You can upload jpg, jpeg, png, svg, gif and webp.',
                'web-stories'
              )}
            </Text>
          </Overlay>
        </OverlayWrapper>
      )}
      <OverContent>{children}</OverContent>
    </DropzoneComponent>
  );
}

Dropzone.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Dropzone;
