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
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  Input,
  themeHelpers,
} from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';
import { useState, useMemo, useCallback } from '@googleforcreators/react';
import {
  getExtensionsFromMimeType,
  ResourcePropTypes,
} from '@googleforcreators/media';
import { useFeature } from 'flagged';
import { trackError, trackEvent } from '@googleforcreators/tracking';
/**
 * Internal dependencies
 */
import { Row } from '../../form';
import Tooltip from '../../tooltip';
import { useConfig } from '../../../app/config';
import { MULTIPLE_DISPLAY_VALUE } from '../../../constants';
import HotlinkModal from '../../hotlinkModal';
import { focusStyle } from './styles';

const InputRow = styled.div`
  display: flex;
  flex-grow: 1;
  margin-right: 8px;
`;

const ButtonRow = styled(Row)`
  gap: 12px;
`;

const StyledFileInput = styled(Input)(
  ({ $isIndeterminate, theme }) => css`
    ${focusStyle};
    ${!$isIndeterminate &&
    css`
      * > input:disabled {
        color: ${theme.colors.fg.primary};
      }
    `};
  `
);

const StyledButton = styled(Button)`
  ${({ theme }) =>
    themeHelpers.focusableOutlineCSS(
      theme.colors.border.focus,
      theme.colors.bg.secondary
    )};
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
  clearFileText = __('Remove file', 'web-stories'),
}) {
  const {
    allowedMimeTypes: { caption: allowedCaptionMimeTypes = [] },
    capabilities: { hasUploadMediaAction },
    MediaUpload,
  } = useConfig();
  const [isOpen, setIsOpen] = useState(false);

  const enableCaptionHotlinking = useFeature('captionHotlinking');

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

  if (!allowedCaptionMimeTypes?.length) {
    return null;
  }

  return (
    <>
      {isIndeterminate && (
        <Row>
          <StyledFileInput
            value={MULTIPLE_DISPLAY_VALUE}
            disabled
            aria-label={__('Filename', 'web-stories')}
            onChange={() => handleRemoveTrack()}
            $isIndeterminate={isIndeterminate}
          />
        </Row>
      )}
      {tracks.map(({ id, trackName }) => (
        <Row key={`row-filename-${id}`}>
          <InputRow>
            <StyledFileInput
              value={trackName}
              aria-label={__('Filename', 'web-stories')}
              onChange={() => handleRemoveTrack(id)}
              disabled
            />
          </InputRow>
          <Tooltip hasTail title={clearFileText}>
            <StyledButton
              aria-label={clearFileText}
              type={BUTTON_TYPES.TERTIARY}
              size={BUTTON_SIZES.SMALL}
              variant={BUTTON_VARIANTS.SQUARE}
              onClick={() => handleRemoveTrack(id)}
            >
              <Icons.Trash />
            </StyledButton>
          </Tooltip>
        </Row>
      ))}
      {!tracks.length && !isIndeterminate && (
        <ButtonRow spaceBetween={false}>
          {hasUploadMediaAction && (
            <MediaUpload
              onSelect={handleChangeTrack}
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
          {enableCaptionHotlinking && (
            <>
              <HotlinkButton
                variant={BUTTON_VARIANTS.RECTANGLE}
                type={BUTTON_TYPES.SECONDARY}
                size={BUTTON_SIZES.SMALL}
                onClick={() => setIsOpen(true)}
              >
                {__('Link to caption file', 'web-stories')}
              </HotlinkButton>
              <HotlinkModal
                title={__('Insert external captions', 'web-stories')}
                isOpen={isOpen}
                onSelect={onSelect}
                onError={onError}
                onClose={() => setIsOpen(false)}
                allowedFileTypes={allowedFileTypes}
                insertText={__('Use caption', 'web-stories')}
                insertingText={__('Selecting caption', 'web-stories')}
              />
            </>
          )}
        </ButtonRow>
      )}
    </>
  );
}

CaptionsPanelContent.propTypes = {
  isIndeterminate: PropTypes.bool,
  tracks: PropTypes.arrayOf(ResourcePropTypes.trackResource),
  captionText: PropTypes.string,
  clearFileText: PropTypes.string,
  handleChangeTrack: PropTypes.func,
  handleRemoveTrack: PropTypes.func,
  renderUploadButton: PropTypes.func,
};

export default CaptionsPanelContent;
