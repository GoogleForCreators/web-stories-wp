/*
 * Copyright 2021 Google LLC
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
/**
 * Internal dependencies
 */
/**
 * Internal dependencies
 */
import { useConfig } from '../..';

const mediaUploadPropsType = {
  title: PropTypes.string,
  buttonInsertText: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onSelectErrorMessage: PropTypes.string,
  onClose: PropTypes.func,
  onPermissionError: PropTypes.func,
  type: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  cropParams: PropTypes.object,
  multiple: PropTypes.bool,
};

const MediaUploadWrapper = ({ children, mediaUploadProps, ...props }) => {
  const { MediaUpload } = useConfig();

  return (
    <MediaUpload
      {...mediaUploadProps}
      // overwrite `onClick` because the only way to access the open
      // function is to dive into the MediaUpload component in the render prop.
      render={(open) => children({ ...props, onClick: open })}
    />
  );
};
MediaUploadWrapper.propTypes = {
  children: PropTypes.func.isRequired,
  mediaUploadProps: PropTypes.shape(mediaUploadPropsType),
};

const WithMediaUploadWrapper = ({ children, ...props }) => (
  <MediaUploadWrapper mediaUploadProps={props}>{children}</MediaUploadWrapper>
);
WithMediaUploadWrapper.propTypes = {
  children: PropTypes.func.isRequired,
  ...mediaUploadPropsType,
};

export default WithMediaUploadWrapper;
