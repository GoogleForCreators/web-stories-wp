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
import { formatDate, toDate, isValid } from '@web-stories-wp/date';
import { __, sprintf } from '@web-stories-wp/i18n';
import { trackError } from '@web-stories-wp/tracking';
/**
 * Internal dependencies
 */
import { useAPI } from '../../../../../app/api';
import Dialog from '../../../../dialog';
import { Plain } from '../../../../button';
import { useLocalMedia } from '../../../../../app/media';
import { useSnackbar } from '../../../../../app/snackbar';
import StoryPropTypes from '../../../../../types';
import { getSmallestUrlForWidth } from '../../../../../elements/media/util';

const THUMBNAIL_WIDTH = 152;

const styledMediaThumbnail = css`
  display: flex;
  width: ${THUMBNAIL_WIDTH}px;
  margin-right: 28px;
`;

const Image = styled.img`
  ${styledMediaThumbnail}
`;

const Video = styled.video`
  ${styledMediaThumbnail}
`;

const DialogBody = styled.div`
  display: flex;
  justify-content: left;
  align-items: flex-start;
`;

const MetadataTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const MediaDateText = styled.div`
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.date.family};
  line-height: ${({ theme }) => theme.DEPRECATED_THEME.fonts.date.lineHeight};
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.date.size};
  font-weight: ${({ theme }) => theme.DEPRECATED_THEME.fonts.date.weight};
  color: ${({ theme }) => theme.DEPRECATED_THEME.grayout};
  margin-bottom: 8px;
`;

const MediaTitleText = styled.div`
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.title.family};
  line-height: ${({ theme }) => theme.DEPRECATED_THEME.fonts.title.lineHeight};
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.title.size};
  font-weight: ${({ theme }) => theme.DEPRECATED_THEME.fonts.title.weight};
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.bg.v9};
`;

const MediaSizeText = styled.div`
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body1.family};
  line-height: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body1.lineHeight};
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body1.size};
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.bg.v11};
`;

const Input = styled.input`
  background: ${({ theme }) => theme.DEPRECATED_THEME.colors.bg.white};
  border: 1px solid ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.v3};
  box-sizing: border-box;
  border-radius: 4px;
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.input.family};
  line-height: ${({ theme }) => theme.DEPRECATED_THEME.fonts.input.lineHeight};
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.input.size};
  padding: 7px 10px;
  margin-top: 20px;
  margin-bottom: 4px;
`;

const DialogDescription = styled.p`
  font-family: ${({ theme }) =>
    theme.DEPRECATED_THEME.fonts.description.family};
  line-height: ${({ theme }) =>
    theme.DEPRECATED_THEME.fonts.description.lineHeight};
  font-weight: ${({ theme }) =>
    theme.DEPRECATED_THEME.fonts.description.weight};
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.description.size};
  color: ${({ theme }) => theme.DEPRECATED_THEME.grayout};
  margin: 0;
`;

const imageDialogTitle = __('Edit Image', 'web-stories');
const videoDialogTitle = __('Edit Video', 'web-stories');
const imageInputTitle = __('Assistive text', 'web-stories');
const videoInputTitle = __('Video description', 'web-stories');
const imageDialogDescription = __(
  'Describe the appearance and function of the image. Leave empty if the image is purely decorative.',
  'web-stories'
);
const videoDialogDescription = __(
  'For indexability and accessibility. Include any burned-in text inside the video.',
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
    creationDate,
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
  const { updateMediaElement } = useLocalMedia((state) => ({
    updateMediaElement: state.actions.updateMediaElement,
  }));
  const { showSnackbar } = useSnackbar();
  const [altText, setAltText] = useState(alt);
  const parsedDate = toDate(creationDate);

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
      trackError('local_media_edit', err.message);
      showSnackbar({
        message: __('Failed to update, please try again.', 'web-stories'),
      });
    }
  }, [altText, id, onClose, showSnackbar, updateMedia, updateMediaElement]);

  const isImage = type === 'image';

  return (
    <Dialog
      open={true}
      onClose={onClose}
      title={isImage ? imageDialogTitle : videoDialogTitle}
      actions={
        <>
          <Plain onClick={onClose}>{__('Cancel', 'web-stories')}</Plain>
          <Plain onClick={updateMediaItem}>{__('Save', 'web-stories')}</Plain>
        </>
      }
      maxWidth={530}
    >
      <DialogBody>
        {type === 'image' ? (
          <Image
            src={getSmallestUrlForWidth(THUMBNAIL_WIDTH, resource)}
            alt={alt}
            loading={'lazy'}
          />
        ) : (
          <Video key={src} poster={poster} preload="none" muted>
            <source src={src} type={mimeType} />
          </Video>
        )}
        <MetadataTextContainer>
          {isValid(parsedDate) && (
            <MediaDateText>
              {sprintf(
                /* translators: %s: upload date of media item. */
                __('Uploaded: %s', 'web-stories'),
                formatDate(creationDate)
              )}
            </MediaDateText>
          )}
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
            aria-label={isImage ? imageInputTitle : videoInputTitle}
            type="text"
            placeholder={isImage ? imageInputTitle : videoInputTitle}
            onChange={handleAltTextChange}
          />
          <DialogDescription>
            {isImage ? imageDialogDescription : videoDialogDescription}
          </DialogDescription>
        </MetadataTextContainer>
      </DialogBody>
    </Dialog>
  );
}

MediaEditDialog.propTypes = {
  resource: StoryPropTypes.resource.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MediaEditDialog;
