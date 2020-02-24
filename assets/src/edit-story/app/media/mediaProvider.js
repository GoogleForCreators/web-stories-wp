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

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useConfig } from '../config';
import useLoadMedia from './actions/useLoadMedia';
import useCompleteMedia from './actions/useCompleteMedia';
import useReloadMedia from './actions/useReloadMedia';
import useResetMedia from './actions/useResetMedia';
import useUploadVideoFrame from './actions/useUploadVideoFrame';
import useInsertMediaElement from './actions/useInsertMediaElement';
import useGetMediaElement from './actions/useGetMediaElement';
import Context from './context';

function MediaProvider({ children }) {
  const [media, setMedia] = useState([]);
  const [mediaType, setMediaType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(false);

  const DEFAULT_WIDTH = 150;

  const {
    allowedMimeTypes: {
      image: allowedImageMimeTypes,
      video: allowedVideoMimeTypes,
    },
  } = useConfig();

  const completeMedia = useCompleteMedia({
    setIsMediaLoading,
    setIsMediaLoaded,
  });
  const loadMedia = useLoadMedia({
    setMedia,
    completeMedia,
    setIsMediaLoading,
    isMediaLoaded,
    isMediaLoading,
    mediaType,
    searchTerm,
  });
  const reloadMedia = useReloadMedia({ setIsMediaLoading, setIsMediaLoaded });
  const resetMedia = useResetMedia({
    setMediaType,
    setSearchTerm,
    reloadMedia,
  });

  const { uploadVideoFrame } = useUploadVideoFrame();
  const insertMediaElement = useInsertMediaElement({
    uploadVideoFrame,
    allowedImageMimeTypes,
    allowedVideoMimeTypes,
  });

  const getMediaElement = useGetMediaElement({
    insertMediaElement,
    allowedImageMimeTypes,
    allowedVideoMimeTypes,
  });

  const state = {
    state: {
      media,
      isMediaLoading,
      isMediaLoaded,
      mediaType,
      searchTerm,
      DEFAULT_WIDTH,
    },
    actions: {
      setMediaType,
      setSearchTerm,
      loadMedia,
      reloadMedia,
      resetMedia,
      insertMediaElement,
      getMediaElement,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

MediaProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default MediaProvider;
