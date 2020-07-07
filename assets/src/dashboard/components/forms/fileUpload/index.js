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
import { useCallback, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import { visuallyHiddenStyles } from '../../../utils/visuallyHiddenStyles';

const DEFAULT_FILE_TYPES = ['.jpg', '.jpeg', '.png'];

const Input = styled.input(visuallyHiddenStyles);
const UploadFormArea = styled.div`
  width: 100%;
  max-width: 600px;
  height: 400px;
  border: 1px solid gray;
  background-color: ${({ isDragging }) => (isDragging ? 'blue' : 'salmon')};
`;

function disableDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

const FileUploadForm = ({
  id,
  label,
  handleSubmit,
  isMultiple,
  ariaLabel,
  uploadedContent = [],
  acceptableFormats = DEFAULT_FILE_TYPES,
}) => {
  const uploadFileContainer = useRef(null);
  const fileInputRef = useRef(null);
  const [isDragging, setDragging] = useState(false);

  const handleFileVerifyPreSubmit = useCallback(
    (files) => {
      handleSubmit(Object.values(files));
    },
    [handleSubmit]
  );

  const handleChange = useCallback(
    (event) => {
      handleFileVerifyPreSubmit(event.target.files);
    },
    [handleFileVerifyPreSubmit]
  );

  const handleDragDrop = useCallback(
    (e) => {
      disableDefaults(e);
      const files = e.dataTransfer?.files;
      handleFileVerifyPreSubmit(files);
      setDragging(false);
    },
    [handleFileVerifyPreSubmit]
  );

  const handleDrag = useCallback((e) => {
    disableDefaults(e);
    setDragging((prevIsDragging) => !prevIsDragging);
  }, []);

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
    >
      <label htmlFor={id} aria-label={ariaLabel}>
        {label}
        <Input
          ref={fileInputRef}
          type="file"
          id={id}
          data-testid={'upload-file-input'}
          accept={acceptableFormats.join(',')}
          multiple={isMultiple}
        />
      </label>
      {uploadedContent.map((file, idx) => (
        <img key={idx} alt={file.title} src={file.src} />
      ))}
    </UploadFormArea>
  );
};

FileUploadForm.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isMultiple: PropTypes.bool,
  ariaLabel: PropTypes.string,
  acceptableFormats: PropTypes.arrayOf(PropTypes.string),
  uploadedContent: PropTypes.arrayOf(
    PropTypes.shape({ src: PropTypes.string, name: PropTypes.string })
  ),
};

export default FileUploadForm;
