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

import { useRef } from '@web-stories-wp/react';
import PropTypes from 'prop-types';
/**
 * Internal dependencies
 */
import { useConfig } from '..';
import Context from './context';

function OpenMediaUploadHandler({ onOpenMediaUpload, ...props }) {
  /**
   * `open` needs to be stored in a ref so that it does not cause endless
   * re-renders for any children.
   */
  const openRef = useRef(open);
  openRef.current = onOpenMediaUpload;

  return (
    <Context.Provider
      {...props}
      value={{ onOpenMediaUpload: openRef.current }}
    />
  );
}
OpenMediaUploadHandler.propTypes = {
  onOpenMediaUpload: PropTypes.func.isRequired,
};

/**
 * The media upload provider.
 *
 * The `MediaUpload` component is passed into the application from the
 * config. There is not a way to access the `open` function outside
 * of the `render` prop. This provider gives a way to access the `open`
 * function for use anywhere in the application, passed through context.
 *
 * NOTE: Every time the wording and functionality of the modal
 * needs to change, the provider must be re-rendered with those arguments!!!
 *
 * Ex:
 * ```js
 * return (
 *  <MediaUploadProvider
 *    title={__('Select media', 'web-stories')}
 *    buttonInsertText={__('Insert media', 'web-stories')}
 *  >
 *    {...}
 *  </MediaUploadProvider>
 * )
 * ```
 * vs
 * ```js
 * return (
 *  <MediaUploadProvider
 *    title={__('Replace media', 'web-stories')}
 *    buttonInsertText={__('Put in the media', 'web-stories')}
 *  >
 *    {...}
 *  </MediaUploadProvider>
 * )
 * ```
 *
 * @param {Object} props Provider props
 * @param {Node} props.children The children
 * @return {Node} The wrapped children
 */
function MediaUploadProvider({ children, ...props }) {
  const { MediaUpload } = useConfig();

  return (
    <MediaUpload
      {...props}
      render={(open) => (
        /* the only way to access `open` is through the render prop of `MediaUpload` */
        <OpenMediaUploadHandler onOpenMediaUpload={open}>
          {children}
        </OpenMediaUploadHandler>
      )}
    />
  );
}
MediaUploadProvider.propTypes = {
  buttonInsertText: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  cropParams: PropTypes.bool,
  multiple: PropTypes.bool,
  onClose: PropTypes.func,
  onPermissionError: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
  onSelectErrorMessage: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
};

export default MediaUploadProvider;
