/*
 * Copyright 2022 Google LLC
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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Text,
  THEME_CONSTANTS,
} from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';
import { useState, useMemo, useCallback } from '@googleforcreators/react';
import {
  getExtensionsFromMimeType,
  ResourcePropTypes,
} from '@googleforcreators/media';
import { trackError, trackEvent } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import { Row } from '../../../form';
import { useConfig } from '../../../../app/config';
import { MULTIPLE_DISPLAY_VALUE } from '../../../../constants';
import HotlinkModal from '../../../hotlinkModal';
import { MediaUpload } from '../../../mediaUpload';
import FileRow from './fileRow';

const ButtonRow = styled(Row)`
  gap: 12px;
`;

const FileName = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.primary};
`;

const HotlinkButton = styled(Button)`
  padding: 12px 8px;
`;

const eventName = 'hotlink_caption';

function CaptionsPanelContent({
  isIndeterminate = false,
  tracks = [],
  captionText = __('Upload a file', 'web-stories'),
  handleChangeTrack,
  handleRemoveTrack,
  renderUploadButton,
  removeItemLabel = __('Remove file', 'web-stories'),
}) {
  const {
    allowedMimeTypes: { caption: allowedCaptionMimeTypes = [] },
    capabilities: { hasUploadMediaAction },
  } = useConfig();

  const [isOpen, setIsOpen] = useState(false);

  const allowedFileTypes = useMemo(
    () =>
      allowedCaptionMimeTypes
        .map((type) => getExtensionsFromMimeType(type))
        .flat(),
    [allowedCaptionMimeTypes]
  );

  const onSelect = useCallback(
    ({ link, hotlinkInfo, needsProxy }) => {
      const track = {
        src: link,
        needsProxy,
      };
      handleChangeTrack(track);
      trackEvent(eventName, {
        event_label: link,
        file_size: hotlinkInfo.fileSize,
        file_type: hotlinkInfo.mimeType,
        needs_proxy: needsProxy,
      });
      setIsOpen(false);
    },
    [handleChangeTrack]
  );

  const onError = useCallback((err) => trackError(eventName, err?.message), []);
  const onDeleteTrack = useCallback(
    (deletedResource) => handleRemoveTrack(deletedResource.id),
    [handleRemoveTrack]
  );

  if (!allowedCaptionMimeTypes?.length) {
    return null;
  }

  const options = [
    hasUploadMediaAction && {
      label: __('Upload a file', 'web-stories'),
      value: 'upload',
      onClick: () => {},
      mediaPickerProps: {
        onSelect: handleChangeTrack,
        onDelete: onDeleteTrack,
        onSelectErrorMessage: __(
          'Please choose a VTT file to use as caption.',
          'web-stories'
        ),
        type: allowedCaptionMimeTypes,
        title: captionText,
        buttonInsertText: __('Select caption', 'web-stories'),
      },
    },
    {
      label: __('Link to a file', 'web-stories'),
      value: 'hotlink',
      onClick: () => {
        setIsOpen(true);
      },
    },
  ].filter(Boolean);

  return (
    <>
      {isIndeterminate && (
        <Row>
          <FileName>{MULTIPLE_DISPLAY_VALUE}</FileName>
        </Row>
      )}
      {tracks.map((track) => (
        <FileRow
          key={track.id}
          id={track.id}
          src={track.track}
          title={track.track.split('/').pop()}
          isExternal={!track.trackId}
          options={options}
          onRemove={handleRemoveTrack}
          removeItemLabel={removeItemLabel}
        />
      ))}
      {!tracks.length && !isIndeterminate && (
        <ButtonRow spaceBetween={false}>
          {hasUploadMediaAction && (
            <MediaUpload
              onSelect={handleChangeTrack}
              onDeleteMedia={onDeleteTrack}
              onSelectErrorMessage={__(
                'Please choose a VTT file to use as caption.',
                'web-stories'
              )}
              type={allowedCaptionMimeTypes}
              title={captionText}
              buttonInsertText={__('Select caption', 'web-stories')}
              render={renderUploadButton}
            />
          )}
          <HotlinkButton
            variant={BUTTON_VARIANTS.RECTANGLE}
            type={BUTTON_TYPES.SECONDARY}
            size={BUTTON_SIZES.SMALL}
            onClick={() => setIsOpen(true)}
          >
            {__('Link to caption file', 'web-stories')}
          </HotlinkButton>
        </ButtonRow>
      )}
      <HotlinkModal
        title={__('Insert external captions', 'web-stories')}
        isOpen={isOpen}
        onSelect={onSelect}
        onError={onError}
        onClose={() => setIsOpen(false)}
        allowedFileTypes={allowedFileTypes}
        insertText={__('Use caption', 'web-stories')}
        insertingText={__('Selecting caption', 'web-stories')}
        canUseProxy={false}
      />
    </>
  );
}

CaptionsPanelContent.propTypes = {
  isIndeterminate: PropTypes.bool,
  tracks: PropTypes.arrayOf(ResourcePropTypes.trackResource),
  captionText: PropTypes.string,
  removeItemLabel: PropTypes.string,
  handleChangeTrack: PropTypes.func,
  handleRemoveTrack: PropTypes.func,
  renderUploadButton: PropTypes.func,
};

export default CaptionsPanelContent;
