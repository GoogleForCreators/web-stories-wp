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
import { __ } from '@wordpress/i18n';

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
  padding: 40px 0;
  border-radius: 4px;
  border: ${({ isDragging, theme }) =>
    isDragging ? theme.borders.bluePrimary : theme.borders.gray100};
  border-style: dashed;

  transition: border-color 300ms ease-in;
`;

const UploadHelperText = styled.span`
  ${TypographyPresets.ExtraSmall};
  margin: 0 auto 16px;
  padding: 0 20%;
  color: ${({ theme }) => theme.colors.gray200};
`;

/* TODO: new button styles */
const UploadLabelAsCta = styled(DefaultButton).attrs({
  as: 'label',
})`
  margin: 0 auto;
  align-self: flex-end;
  z-index: 10;
  font-size: 14px;
  line-height: 16px;

  &:focus-within {
    border: ${({ theme }) => theme.borders.action};
  }
`;

function disableDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

const FileUpload = ({
  id,
  label,
  onSubmit,
  isMultiple,
  ariaLabel,
  instructionalText = __('You can also drag your file here', 'web-stories'),
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

  useEffect(() => {
    if (!fileInputRef?.current) {
      return;
    }

    fileInputRef.current.addEventListener('change', handleChange);
    () => {
      fileInputRef.current.removeEventListener('change', handleChange);
    };
  }, [handleChange]);

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
      <UploadHelperText>{instructionalText}</UploadHelperText>

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
  onSubmit: PropTypes.func.isRequired,
  isMultiple: PropTypes.bool,
  ariaLabel: PropTypes.string,
  acceptableFormats: PropTypes.arrayOf(PropTypes.string),
  instructionalText: PropTypes.string,
};

export default FileUpload;
