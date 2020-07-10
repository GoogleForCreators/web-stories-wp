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
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { useCallback, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import { DEFAULT_FILE_UPLOAD_TYPES } from '../../constants';
import { visuallyHiddenStyles } from '../../utils/visuallyHiddenStyles';
import { DefaultButton } from '../button';
import { Close as _DeleteIcon, UploadIcon as _UploadIcon } from '../../icons';
import { TypographyPresets } from '../typography';

const Input = styled.input(visuallyHiddenStyles);
const UploadFormArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  justify-content: flex-end;
  width: 100%;
  min-height: 153px;
  padding: 36px 36px 10px;
  border-radius: 4px;
  border: ${({ isDragging, theme }) =>
    isDragging ? theme.borders.bluePrimary : theme.borders.transparent};
  border-width: 2px;
  background-color: ${({ theme }) => theme.colors.gray25};

  transition: border-color 300ms ease-in;
`;

const StaticUploadArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.gray500};
  z-index: 0;
`;

const StaticAreaText = styled.span`
  ${TypographyPresets.Medium};
  margin: 0 auto 20px;
`;

const StaticAreaIcon = styled(_UploadIcon)`
  width: 52px;
  height: 52px;
`;
const UploadedContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-self: flex-start;
`;

const DeleteButton = styled.button`
  position: absolute;
  z-index: 10;
  border-radius: 100%;
  width: 30px;
  height: 30px;
  margin-top: -10px;
  margin-left: -10px;
  background-color: ${({ theme }) => theme.colors.gray75};
  color: ${({ theme }) => theme.colors.gray500};
  border: ${({ theme }) => theme.borders.transparent};
  opacity: 1;

  transition: opacity 300ms ease-in-out;
`;

const UploadedContent = styled.div`
  width: 60px;
  margin: 0 15px 10px 0;

  ${DeleteButton} {
    opacity: 0;
    visibility: none;
  }

  &:hover,
  &:focus {
    ${DeleteButton} {
      opacity: 1;
      visibility: visible;
    }
  }
`;

const DisplayImage = styled.img`
  width: 100%;
  height: 60px;
  margin-bottom: 5px;
  object-fit: cover;
`;

const DeleteIcon = styled(_DeleteIcon)`
  width: 100%;
  height: 100%;
`;

const DisplayTitle = styled.span`
  ${TypographyPresets.ExtraSmall};
  display: inline-block;
  width: 100%;
  margin-right: 0.5em;
  white-space: normal;
  word-break: break-word;
`;

const UploadLabelAsCta = styled(DefaultButton).attrs({
  as: 'label',
})`
  margin: 0 auto;
  align-self: flex-end;
  z-index: 10;
  font-size: 14px;
  line-height: 16px;
`;

function disableDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

const FileUpload = ({
  id,
  label,
  onDelete,
  onSubmit,
  isFileNameVisible,
  isMultiple,
  ariaLabel,
  emptyDragHelperText = __('You can also drag your file here', 'web-stories'),
  uploadedContent = [],
  acceptableFormats = DEFAULT_FILE_UPLOAD_TYPES,
}) => {
  const uploadFileContainer = useRef(null);
  const fileInputRef = useRef(null);
  const [isDragging, setDragging] = useState(false);

  const handleUploadFile = useCallback(
    (files) => {
      onSubmit(Object.values(files));
    },
    [onSubmit]
  );

  const handleChange = useCallback(
    (e) => {
      disableDefaults(e);
      handleUploadFile(e.target.files);
      fileInputRef.current.value = null;
    },
    [handleUploadFile]
  );

  const handleDragDrop = useCallback(
    (e) => {
      disableDefaults(e);
      const files = e.dataTransfer.files;
      if (files) {
        handleUploadFile(files);
      }
      setDragging(false);
    },
    [handleUploadFile]
  );

  const handleDrag = useCallback(
    (e) => {
      disableDefaults(e);
      setDragging((prevIsDragging) => !prevIsDragging);

      if (isDragging) {
        e.dataTransfer.clearData();
      }
    },
    [isDragging]
  );

  const handleDeleteFile = useCallback(
    (index, fileData) => {
      onDelete(index, fileData);
    },
    [onDelete]
  );

  useEffect(() => {
    if (!fileInputRef?.current) {
      return;
    }

    fileInputRef.current.addEventListener('change', handleChange);
    () => {
      fileInputRef.current.removeEventListener('change', handleChange);
    };
  }, [handleChange]);

  const hasUploadedContent = uploadedContent.length > 0;
  return (
    <UploadFormArea
      ref={uploadFileContainer}
      isDragging={isDragging}
      onDrop={handleDragDrop}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={disableDefaults}
      data-testid="file-upload-drop-area"
    >
      {hasUploadedContent ? (
        <UploadedContentContainer data-testid="file-upload-content-container">
          {uploadedContent.map((file, idx) => (
            <UploadedContent key={idx}>
              {Boolean(onDelete) && (
                <DeleteButton
                  data-testid={`file-upload-delete-button_${idx}`}
                  onClick={() => handleDeleteFile(idx, file)}
                  aria-label={sprintf(
                    /* translators: %s is the file name to delete */
                    __('Delete %s', 'web-stories'),
                    file.title
                  )}
                >
                  <DeleteIcon />
                </DeleteButton>
              )}
              <DisplayImage
                alt={file.title}
                title={file.title}
                src={file.src}
              />
              {isFileNameVisible && <DisplayTitle>{file.title}</DisplayTitle>}
            </UploadedContent>
          ))}
        </UploadedContentContainer>
      ) : (
        <StaticUploadArea aria-hidden={true}>
          <StaticAreaIcon />
          <StaticAreaText>{emptyDragHelperText}</StaticAreaText>
        </StaticUploadArea>
      )}

      <UploadLabelAsCta htmlFor={id} aria-label={ariaLabel}>
        {label}
        <Input
          ref={fileInputRef}
          type="file"
          id={id}
          data-testid={'upload-file-input'}
          accept={acceptableFormats.join(',')}
          multiple={isMultiple}
        />
      </UploadLabelAsCta>
    </UploadFormArea>
  );
};

FileUpload.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  isMultiple: PropTypes.bool,
  isFileNameVisible: PropTypes.bool,
  ariaLabel: PropTypes.string,
  acceptableFormats: PropTypes.arrayOf(PropTypes.string),
  uploadedContent: PropTypes.arrayOf(
    PropTypes.shape({ src: PropTypes.string, name: PropTypes.string })
  ),
  emptyDragHelperText: PropTypes.string,
};

export default FileUpload;
