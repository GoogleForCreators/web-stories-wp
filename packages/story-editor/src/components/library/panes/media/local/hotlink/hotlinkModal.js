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
import { __, sprintf, translateToExclusiveList } from '@web-stories-wp/i18n';
import { Input } from '@web-stories-wp/design-system';
import { useState, useCallback } from 'react';
import styled from 'styled-components';
import {
  createResource,
  getFileNameFromUrl,
  getFirstFrameOfVideo,
  getImageDimensions,
  getVideoDimensions,
} from '@web-stories-wp/media';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../../../../app';
import Dialog from '../../../../../dialog';
import useLibrary from '../../../../useLibrary';
import {
  useUploadVideoFrame,
  getPosterName,
} from '../../../../../../app/media/utils';
import { withProtocol } from '../../../../../../utils/url';

const InputWrapper = styled.div`
  margin: 16px 4px;
  width: 470px;
  height: 100px;
`;

function HotlinkModal({ isOpen, onClose }) {
  const {
    allowedFileTypes,
    capabilities: { hasUploadMediaAction },
  } = useConfig();
  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));

  const { uploadVideoPoster } = useUploadVideoFrame({});

  const [errorMsg, setErrorMsg] = useState(false);

  // @todo We're not really uploading anything here, so should we have a fixed list instead?
  let description = __('No file types are currently supported.', 'web-stories');
  if (allowedFileTypes.length) {
    description = sprintf(
      /* translators: %s is a list of allowed file extensions. */
      __('You can insert %s.', 'web-stories'),
      translateToExclusiveList(allowedFileTypes)
    );
  }
  const error = sprintf(
    /* translators: %s is the description with allowed file extensions. */
    __('Invalid link. %s', 'web-stories'),
    description
  );
  const [link, setLink] = useState('');

  const getFileInfo = useCallback(
    (value = link) => {
      const ext = value.split(/[#?]/)[0].split('.').pop().trim();
      if (!allowedFileTypes.includes(ext)) {
        setErrorMsg(error);
      } else {
        setErrorMsg(null);
      }
      return {
        ext,
        type: ['m4v', 'mp4'].includes(ext) ? 'video' : 'image',
      };
    },
    [link, allowedFileTypes, error]
  );

  const onInsert = useCallback(async () => {
    if (errorMsg?.length) {
      return;
    }
    try {
      const { type } = getFileInfo();
      const isVideo = type === 'video';
      const getMediaDimensions = isVideo
        ? getVideoDimensions
        : getImageDimensions;
      const { width, height } = await getMediaDimensions(link);

      // Create a poster file in case of videos.
      let posterData;
      if (isVideo && hasUploadMediaAction) {
        const originalFileName = getFileNameFromUrl(link);
        const fileName = getPosterName(originalFileName);
        const posterFile = await getFirstFrameOfVideo(link);
        posterData = await uploadVideoPoster(0, fileName, posterFile);
      }
      insertElement(type, {
        resource: createResource({
          alt: link.substring(link.lastIndexOf('/') + 1),
          width,
          height,
          src: link,
          local: false,
          poster: isVideo ? posterData.poster : null,
          posterId: isVideo ? posterData.posterId : null,
        }),
      });
      setErrorMsg(null);
      setLink('');
      onClose();
    } catch (e) {
      setErrorMsg(
        __(
          'Media failed to load. Please ensure the link is valid and the site allows linking from external sites',
          'web-stories'
        )
      );
    }
  }, [insertElement, link, errorMsg, getFileInfo, onClose, uploadVideoPoster]);

  return (
    <Dialog
      onClose={() => {
        onClose();
        setLink('');
        setErrorMsg(false);
      }}
      isOpen={isOpen}
      title={__('Insert external image or video', 'web-stories')}
      onPrimary={() => onInsert()}
      primaryText={__('Insert', 'web-stories')}
      secondaryText={__('Cancel', 'web-stories')}
    >
      <InputWrapper>
        <Input
          onChange={({ target: { value } }) => {
            setLink(value);
            getFileInfo(value);
          }}
          value={link}
          hint={errorMsg?.length ? errorMsg : description}
          hasError={Boolean(errorMsg?.length)}
          onBlur={() => setLink(withProtocol(link))}
          label={__('URL', 'web-stories')}
        />
      </InputWrapper>
    </Dialog>
  );
}

HotlinkModal.propTypes = {
  onClose: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default HotlinkModal;
