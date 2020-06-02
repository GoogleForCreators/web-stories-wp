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
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useAPI } from '../../../../app/api';
import Dialog from '../../../../components/dialog';
import { Plain, Primary } from '../../../../components/button';
import { useSnackbar } from '../../../../app/snackbar';
import UseMedia from '../../../../app/media/useMedia';
import getThumbnailUrl from '../../../../app/media/utils/getThumbnailUrl';

const styledMediaThumbnail = css`
  display: flex;
  width: 152px;
  margin-right: 28px;
`;

const Image = styled.img`
  ${styledMediaThumbnail}
`;

const Video = styled.video`
  ${styledMediaThumbnail}
`;

const DialogBody = styled.div`
  max-width: 480px;
  display: flex;
  justify-content: left;
  align-items: flex-start;
`;

const MetadataTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const MediaTitleText = styled.div`
  font-family: ${({ theme }) => theme.fonts.title.family};
  line-height: ${({ theme }) => theme.fonts.title.lineHeight};
  font-size: ${({ theme }) => theme.fonts.title.size};
  font-weight: ${({ theme }) => theme.fonts.title.weight};
  color: ${({ theme }) => theme.colors.bg.v11};
`;

const MediaSizeText = styled.div`
  font-family: ${({ theme }) => theme.fonts.body1.family};
  line-height: ${({ theme }) => theme.fonts.body1.lineHeight};
  font-size: ${({ theme }) => theme.fonts.body1.size};
  color: ${({ theme }) => theme.colors.bg.v11};
`;

const Input = styled.input`
  background: ${({ theme }) => theme.colors.bg.v13};
  border: 1px solid ${({ theme }) => theme.colors.fg.v3};
  box-sizing: border-box;
  border-radius: 4px;
  font-family: ${({ theme }) => theme.fonts.input.family};
  line-height: ${({ theme }) => theme.fonts.input.lineHeight};
  font-size: ${({ theme }) => theme.fonts.input.size};
  padding: 7px 10px;
  margin-top: 20px;
  margin-bottom: 4px;
`;

const DialogDescription = styled.div`
  font-family: ${({ theme }) => theme.fonts.description.family};
  line-height: ${({ theme }) => theme.fonts.description.lineHeight};
  font-weight: ${({ theme }) => theme.fonts.description.weight};
  font-size: ${({ theme }) => theme.fonts.description.size};
  color: ${({ theme }) => theme.grayout};
`;

const Space = styled.div`
  width: 8px;
`;

const imageDialogTitle = __('Edit Image', 'web-stories');
const videoDialogTitle = __('Edit Video', 'web-stories');
const imageDialogDescription = __(
  'Describe the appearance and function of the image. Leave empty if the image is purely decorative.',
  'web-stories'
);
const videoDialogDescription = __(
  'Describe the appearance and function of the video. Leave empty if the video is purely decorative.',
  'web-stories'
);

/**
 * Displays a dialog where the user can edit the selected media element.
 *
 * @param {Object} props Component props.
 * @param {Object} props.resource Selected media element's resource object.
 * @param {Object} props.onClose Callback to toggle dialog display.
 * @return {null|*} The dialog element.
 */
function MediaEditDialog({ resource, onClose }) {
  const {
    id,
    src,
    title,
    width,
    height,
    type,
    alt,
    poster,
    mimeType,
  } = resource;
  const {
    actions: { updateMedia },
  } = useAPI();
  const {
    actions: { updateMediaElement },
  } = UseMedia();
  const { showSnackbar } = useSnackbar();
  const [altText, setAltText] = useState(alt);

  const handleAltTextChange = useCallback((evt) => {
    setAltText(evt.target.value);
  }, []);

  const updateMediaItem = useCallback(async () => {
    try {
      // Update server.
      await updateMedia(id, { alt_text: altText });
      // Update internal state.
      updateMediaElement({ id, alt: altText });
      onClose();
    } catch (err) {
      showSnackbar({
        message: __('Failed to update, please try again.', 'web-stories'),
      });
    }
  }, [altText, id, onClose, showSnackbar, updateMedia, updateMediaElement]);

  return (
    <Dialog
      open={true}
      onClose={onClose}
      title={type == 'image' ? imageDialogTitle : videoDialogTitle}
      actions={
        <>
          <Plain onClick={onClose}>{__('Cancel', 'web-stories')}</Plain>
          <Space />
          <Primary onClick={updateMediaItem}>
            {__('Save', 'web-stories')}
          </Primary>
        </>
      }
    >
      <DialogBody>
        {type == 'image' ? (
          <Image src={getThumbnailUrl(resource)} alt={alt} loading={'lazy'} />
        ) : (
          <Video key={src} poster={poster} preload="none" muted>
            <source src={src} type={mimeType} />
          </Video>
        )}
        <MetadataTextContainer>
          <MediaTitleText>{title}</MediaTitleText>
          <MediaSizeText>
            {sprintf(
              /* translators: 1: image width. 2: image height. */
              __('%1$d x %2$d pixels', 'web-stories'),
              width,
              height
            )}
          </MediaSizeText>
          <Input
            value={altText}
            aria-label={__('Alt text', 'web-stories')}
            type="text"
            placeholder={__('Alt text', 'web-stories')}
            onChange={handleAltTextChange}
          />
          <DialogDescription>
            {type == 'image' ? imageDialogDescription : videoDialogDescription}
          </DialogDescription>
        </MetadataTextContainer>
      </DialogBody>
    </Dialog>
  );
}

MediaEditDialog.propTypes = {
  resource: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MediaEditDialog;
