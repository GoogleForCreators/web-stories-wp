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
import { useConfig } from '../..';

const MediaUploadWrapper = ({ render, ...props }) => {
  const { MediaUpload } = useConfig();

  return (
    <MediaUpload
      {...props}
      // Only way to access the open function is to dive
      // into the MediaUpload component in the render prop.
      render={(open) => render({ onClick: open })}
    />
  );
};
MediaUploadWrapper.propTypes = {
  render: PropTypes.func.isRequired,
  mediaUploadProps: PropTypes.shape({
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
  }).isRequired,
};

export default MediaUploadWrapper;
